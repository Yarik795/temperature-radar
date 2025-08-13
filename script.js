class TemperatureChart {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.targetTemperature = 24;
        this.tolerance = 1;
        this.width = 800;
        this.height = 800;
        this.radius = Math.min(this.width, this.height) / 2 - 100;
        
        console.log('🔧 TemperatureChart инициализирован');
        console.log('📏 Размеры:', this.width, 'x', this.height, 'радиус:', this.radius);
        
        this.init();
    }

    async init() {
        console.log('🚀 Начинаем инициализацию...');
        await this.loadData();
        this.setupEventListeners();
        this.createChart();
        this.updateStats();
        console.log('✅ Инициализация завершена');
    }

    async loadData() {
        try {
            console.log('📥 Загружаем CSV данные...');
            const response = await fetch('dataexport_20250813T194724.csv');
            const csvText = await response.text();
            console.log('📄 CSV загружен, размер:', csvText.length, 'символов');
            this.parseCSV(csvText);
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            this.showError('Не удалось загрузить данные. Проверьте, что файл CSV находится в той же папке.');
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        this.data = [];
        
        console.log('🔍 Парсим CSV, всего строк:', lines.length);
        
        // Пропускаем метаданные (первые 10 строк)
        for (let i = 10; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && line.includes(',')) {
                const [timestamp, tempStr] = line.split(',');
                const temperature = parseFloat(tempStr);
                
                if (!isNaN(temperature)) {
                    // Парсим временную метку: YYYYMMDDTHHMM
                    const year = parseInt(timestamp.substring(0, 4));
                    const month = parseInt(timestamp.substring(4, 6));
                    const day = parseInt(timestamp.substring(6, 8));
                    const hour = parseInt(timestamp.substring(9, 11));
                    
                    // Вычисляем день года (1-365/366)
                    const date = new Date(year, month - 1, day);
                    const dayOfYear = Math.floor((date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
                    
                    this.data.push({
                        timestamp,
                        temperature,
                        year,
                        month,
                        day,
                        hour,
                        dayOfYear,
                        date: date
                    });
                }
            }
        }
        
        console.log(`✅ Загружено ${this.data.length} записей температурных данных`);
        
        // Анализируем диапазон температур для отладки
        const temps = this.data.map(d => d.temperature);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        console.log(`🌡️ Диапазон температур: от ${minTemp.toFixed(2)}°C до ${maxTemp.toFixed(2)}°C`);
        
        // Показываем примеры температур
        const sampleTemps = temps.slice(0, 20);
        console.log('📊 Примеры температур:', sampleTemps.map(t => t.toFixed(2)));
    }

    setupEventListeners() {
        console.log('🎮 Настраиваем обработчики событий...');
        
        document.getElementById('updateBtn').addEventListener('click', () => {
            this.targetTemperature = parseFloat(document.getElementById('temperature').value);
            this.tolerance = parseFloat(document.getElementById('tolerance').value);
            console.log('🔄 Обновляем диаграмму:', this.targetTemperature, '±', this.tolerance);
            this.updateChart();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            document.getElementById('temperature').value = '24';
            document.getElementById('tolerance').value = '1';
            this.targetTemperature = 24;
            this.tolerance = 1;
            console.log('🔄 Сброс к значениям по умолчанию');
            this.updateChart();
        });

        // Обновление при изменении Enter
        document.getElementById('temperature').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('updateBtn').click();
            }
        });

        document.getElementById('tolerance').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('updateBtn').click();
            }
        });
        
        console.log('✅ Обработчики событий настроены');
    }

    createChart() {
        console.log('🎨 Создаем SVG контейнер...');
        
        const chartContainer = document.getElementById('chart');
        if (!chartContainer) {
            console.error('❌ Элемент #chart не найден!');
            return;
        }
        
        console.log('📦 Контейнер найден:', chartContainer);
        
        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', `translate(${this.width/2}, ${this.height/2})`);

        this.svg = svg;
        console.log('✅ SVG создан, размеры:', this.width, 'x', this.height);
        
        this.updateChart();
    }

    updateChart() {
        if (!this.svg) {
            console.error('❌ SVG не инициализирован!');
            return;
        }

        console.log('🔄 Обновляем диаграмму...');

        // Очищаем предыдущую диаграмму
        this.svg.selectAll('*').remove();

        // Фильтруем данные по заданной температуре с учетом округления
        this.filteredData = this.data.filter(d => {
            // Округляем температуру из данных до 1 знака после запятой для сравнения
            const roundedDataTemp = Math.round(d.temperature * 10) / 10;
            const roundedTargetTemp = Math.round(this.targetTemperature * 10) / 10;
            
            // Проверяем, попадает ли округленная температура в диапазон
            const isInRange = Math.abs(roundedDataTemp - roundedTargetTemp) <= this.tolerance;
            
            // Отладочная информация для первых нескольких записей
            if (d.dayOfYear <= 3 && d.hour <= 3) {
                console.log(`📅 День ${d.dayOfYear}, час ${d.hour}: ${d.temperature}°C -> ${roundedDataTemp}°C, цель: ${roundedTargetTemp}°C ±${this.tolerance}, в диапазоне: ${isInRange}`);
            }
            
            return isInRange;
        });

        console.log(`🔍 Найдено ${this.filteredData.length} записей для температуры ${this.targetTemperature}°C ±${this.tolerance}°C`);
        
        // Показываем примеры найденных записей
        if (this.filteredData.length > 0) {
            const examples = this.filteredData.slice(0, 5);
            console.log('📋 Примеры найденных записей:', examples.map(d => 
                `${d.dayOfYear} день, ${d.hour}:00 - ${d.temperature.toFixed(2)}°C`
            ));
        }

        // Создаем круговую диаграмму
        this.createCircularChart();
        this.updateStats();
    }

    createCircularChart() {
        console.log('⭕ Создаем круговую диаграмму...');
        
        // Создаем сетку: дни по углам, часы по радиусам
        const daysInYear = 365;
        const hoursInDay = 24;
        
        console.log(`📅 Создаем ${daysInYear} дней × ${hoursInDay} часов = ${daysInYear * hoursInDay} секторов`);
        
        // Создаем секторы для каждого часа каждого дня
        const sectors = [];
        
        for (let day = 0; day < daysInYear; day++) {
            for (let hour = 0; hour < hoursInDay; hour++) {
                const dayAngle = (day / daysInYear) * 2 * Math.PI;
                const hourRadius = (hour / hoursInDay) * this.radius;
                
                // Проверяем, есть ли данные для этого времени
                const hasData = this.filteredData.some(d => 
                    d.dayOfYear === day + 1 && d.hour === hour
                );
                
                sectors.push({
                    day,
                    hour,
                    dayAngle,
                    hourRadius,
                    hasData,
                    innerRadius: hourRadius,
                    outerRadius: hourRadius + (this.radius / hoursInDay)
                });
            }
        }

        console.log(`✅ Создано ${sectors.length} секторов`);

        // Создаем дуги
        const arc = d3.arc()
            .innerRadius(d => d.innerRadius)
            .outerRadius(d => d.outerRadius)
            .startAngle(d => d.dayAngle)
            .endAngle(d => d.dayAngle + (2 * Math.PI / daysInYear));

        // Рисуем секторы
        const sectorsGroup = this.svg.selectAll('.sector')
            .data(sectors)
            .enter()
            .append('path')
            .attr('class', 'sector')
            .attr('d', arc)
            .attr('fill', d => d.hasData ? '#ff6b6b' : '#4ecdc4')
            .attr('opacity', d => d.hasData ? 0.8 : 0.3)
            .attr('stroke', '#fff')
            .attr('stroke-width', 0.5)
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());

        console.log(`🎨 Отрисовано ${sectorsGroup.size()} секторов`);

        // Добавляем оси
        this.addAxes();
        
        // Добавляем подписи месяцев
        this.addMonthLabels();
        
        console.log('✅ Круговая диаграмма создана');
    }

    addAxes() {
        console.log('📏 Добавляем оси...');
        
        // Радиальные оси (часы)
        for (let hour = 0; hour <= 24; hour += 6) {
            const radius = (hour / 24) * this.radius;
            const angle = 0;
            
            this.svg.append('line')
                .attr('x1', Math.cos(angle) * radius)
                .attr('y1', Math.sin(angle) * radius)
                .attr('x2', Math.cos(angle) * (radius + 20))
                .attr('y2', Math.sin(angle) * (radius + 20))
                .attr('stroke', '#999')
                .attr('stroke-width', 2);

            this.svg.append('text')
                .attr('x', Math.cos(angle) * (radius + 35))
                .attr('y', Math.sin(angle) * (radius + 35))
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#666')
                .attr('font-size', '12px')
                .text(`${hour}:00`);
        }

        // Угловые оси (дни)
        const monthDays = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
        
        monthDays.forEach((day, i) => {
            const angle = (day / 365) * 2 * Math.PI - Math.PI / 2;
            const x = Math.cos(angle) * (this.radius + 40);
            const y = Math.sin(angle) * (this.radius + 40);
            
            this.svg.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#666')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .text(monthNames[i]);
        });
        
        console.log('✅ Оси добавлены');
    }

    addMonthLabels() {
        // Добавляем центральную подпись
        this.svg.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', '#667eea')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text(`${this.targetTemperature}°C`);
            
        console.log('✅ Центральная подпись добавлена');
    }

    showTooltip(event, d) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        const date = new Date(2024, 0, d.day + 1);
        const monthName = date.toLocaleDateString('ru-RU', { month: 'long' });
        const dayName = date.toLocaleDateString('ru-RU', { weekday: 'long' });
        
        tooltip.html(`
            <strong>${d.day + 1} ${monthName}</strong><br>
            ${dayName}<br>
            Время: ${d.hour.toString().padStart(2, '0')}:00<br>
            ${d.hasData ? '✅ Температура в диапазоне' : '❌ Температура вне диапазона'}
        `);
    }

    hideTooltip() {
        d3.selectAll('.tooltip').remove();
    }

    updateStats() {
        const totalRecords = this.data.length;
        const matchingRecords = this.filteredData.length;
        const percentage = totalRecords > 0 ? ((matchingRecords / totalRecords) * 100).toFixed(1) : 0;
        
        // Анализируем диапазон температур в данных
        const temps = this.data.map(d => d.temperature);
        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);
        
        const statsHtml = `
            <p><strong>Всего записей:</strong> ${totalRecords.toLocaleString()}</p>
            <p><strong>Подходящих записей:</strong> ${matchingRecords.toLocaleString()}</p>
            <p><strong>Процент совпадений:</strong> ${percentage}%</p>
            <p><strong>Диапазон:</strong> ${(this.targetTemperature - this.tolerance).toFixed(1)}°C - ${(this.targetTemperature + this.tolerance).toFixed(1)}°C</p>
            <p><strong>Данные в CSV:</strong> от ${minTemp.toFixed(1)}°C до ${maxTemp.toFixed(1)}°C</p>
        `;
        
        document.getElementById('stats').innerHTML = statsHtml;
        console.log('📊 Статистика обновлена');
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM загружен, создаем TemperatureChart...');
    
    // Проверяем наличие D3.js
    if (typeof d3 === 'undefined') {
        console.error('❌ D3.js не загружен! Проверьте подключение библиотеки');
        alert('ОШИБКА: D3.js не загружен! Проверьте подключение библиотеки в head');
        return;
    }
    
    console.log('✅ D3.js доступен, версия:', d3.version);
    
    try {
        new TemperatureChart();
    } catch (error) {
        console.error('❌ Ошибка при создании TemperatureChart:', error);
        alert('ОШИБКА при создании диаграммы: ' + error.message);
    }
});
