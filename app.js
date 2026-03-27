// ============================================
// Internship Progress Dashboard - JavaScript
// ============================================

// --- Configuration ---
const INTERNSHIP_START = new Date(2026, 2, 16); // March 16, 2026 (month is 0-indexed)
const INTERNSHIP_END = new Date(2026, 5, 12);   // June 12, 2026

// Thai public holidays within the internship period (March 16 - June 12, 2026)
const HOLIDAYS = [
    { date: new Date(2026, 3, 6),  name: 'วันจักรี', nameEn: 'Chakri Memorial Day' },
    { date: new Date(2026, 3, 13), name: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
    { date: new Date(2026, 3, 14), name: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
    { date: new Date(2026, 3, 15), name: 'วันสงกรานต์', nameEn: 'Songkran Festival' },
    { date: new Date(2026, 4, 1),  name: 'วันแรงงานแห่งชาติ', nameEn: 'National Labour Day' },
    { date: new Date(2026, 4, 4),  name: 'วันฉัตรมงคล', nameEn: 'Coronation Day' },
    { date: new Date(2026, 4, 13), name: 'วันพืชมงคล', nameEn: 'Royal Ploughing Ceremony Day' },
    { date: new Date(2026, 5, 1),  name: 'วันหยุดชดเชยวันวิสาขบูชา', nameEn: 'Visakha Bucha Day (Substitute)' },
    { date: new Date(2026, 5, 3),  name: 'วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี', nameEn: "Queen Suthida's Birthday" },
];

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_MONTHS_SHORT = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// --- Utility Functions ---

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

function isHoliday(date) {
    return HOLIDAYS.find(h => isSameDay(h.date, date));
}

function isWorkingDay(date) {
    return !isWeekend(date) && !isHoliday(date);
}

function isInInternshipRange(date) {
    return date >= INTERNSHIP_START && date <= INTERNSHIP_END;
}

function getWorkingDaysBetween(start, end) {
    let count = 0;
    const current = new Date(start);
    while (current <= end) {
        if (isWorkingDay(current)) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
}

function formatThaiDate(date) {
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543;
    const dayName = THAI_DAYS[date.getDay()];
    return `วัน${dayName}ที่ ${day} ${month} พ.ศ. ${year}`;
}

function getBuddhistYear(date) {
    return date.getFullYear() + 543;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

// --- Calculations ---

function calculateProgress() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalWorkingDays = getWorkingDaysBetween(INTERNSHIP_START, INTERNSHIP_END);

    let completedDays = 0;
    let remainingDays = 0;

    if (today < INTERNSHIP_START) {
        completedDays = 0;
        remainingDays = totalWorkingDays;
    } else if (today > INTERNSHIP_END) {
        completedDays = totalWorkingDays;
        remainingDays = 0;
    } else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        completedDays = getWorkingDaysBetween(INTERNSHIP_START, yesterday < INTERNSHIP_START ? INTERNSHIP_START : yesterday);
        
        // If today is a working day and it's past(today), we might count it
        // But let's count today as the current day (not completed yet for accuracy)
        if (today >= INTERNSHIP_START && isWorkingDay(today)) {
            // Count today as "in progress" - add it to completed at end of day
            const now = new Date();
            if (now.getHours() >= 17) {
                completedDays++;
            }
        }
        
        remainingDays = totalWorkingDays - completedDays;
    }

    const percentage = totalWorkingDays > 0 ? (completedDays / totalWorkingDays) * 100 : 0;

    // Calculate which week we're in
    const msPerDay = 24 * 60 * 60 * 1000;
    const totalCalendarDays = Math.ceil((INTERNSHIP_END - INTERNSHIP_START) / msPerDay) + 1;
    const totalWeeks = Math.ceil(totalCalendarDays / 7);

    let currentWeek = 0;
    if (today >= INTERNSHIP_START && today <= INTERNSHIP_END) {
        currentWeek = Math.ceil((today - INTERNSHIP_START + msPerDay) / (7 * msPerDay));
    } else if (today > INTERNSHIP_END) {
        currentWeek = totalWeeks;
    }

    const holidaysInRange = HOLIDAYS.length;

    return {
        totalWorkingDays,
        completedDays,
        remainingDays,
        percentage: Math.min(percentage, 100),
        totalWeeks,
        currentWeek: Math.min(currentWeek, totalWeeks),
        holidaysInRange,
        today
    };
}

// --- UI Rendering ---

function animateNumber(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(start + (target - start) * eased);
        element.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function updateProgressCircle(percentage) {
    const circle = document.getElementById('progressBar');
    const circumference = 2 * Math.PI * 85; // r=85
    const offset = circumference - (percentage / 100) * circumference;

    // Add gradient definition
    const svg = circle.closest('svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.id = 'progressGradient';
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#6366f1');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '50%');
        stop2.setAttribute('stop-color', '#8b5cf6');

        const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop3.setAttribute('offset', '100%');
        stop3.setAttribute('stop-color', '#a78bfa');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 300);
}

function updateLinearProgress(percentage) {
    const fill = document.getElementById('progressBarLinear');
    const glow = document.getElementById('progressBarGlow');
    const label = document.getElementById('progressBarPercent');

    setTimeout(() => {
        fill.style.width = percentage + '%';
        glow.style.width = percentage + '%';
        label.textContent = percentage.toFixed(1) + '%';
    }, 300);
}

function updateStatus(data) {
    const badge = document.getElementById('statusBadge');
    const text = document.getElementById('statusText');

    if (data.today < INTERNSHIP_START) {
        badge.className = 'status-badge before';
        text.textContent = 'ยังไม่เริ่ม';
    } else if (data.today > INTERNSHIP_END) {
        badge.className = 'status-badge after';
        text.textContent = 'เสร็จสิ้นแล้ว ✨';
    } else {
        badge.className = 'status-badge active';
        text.textContent = 'กำลังฝึกงาน';
    }
}

function updateTodaySection(data) {
    const todayDate = document.getElementById('todayDate');
    const todayMessage = document.getElementById('todayMessage');
    const countdownWrapper = document.getElementById('countdownWrapper');
    const countdownLabel = document.getElementById('countdownLabel');
    const countdownGrid = document.getElementById('countdownGrid');

    todayDate.textContent = formatThaiDate(data.today);

    if (data.today < INTERNSHIP_START) {
        const daysUntilStart = Math.ceil((INTERNSHIP_START - data.today) / (24 * 60 * 60 * 1000));
        todayMessage.innerHTML = `🚀 การฝึกงานจะเริ่มขึ้นเร็ว ๆ นี้! เตรียมตัวให้พร้อมนะ<br>อีก <strong style="color:var(--blue)">${daysUntilStart}</strong> วันจะถึงวันเริ่มฝึกงาน`;

        countdownLabel.textContent = '⏰ นับถอยหลังสู่วันเริ่มฝึกงาน';
        countdownGrid.innerHTML = createCountdown(INTERNSHIP_START);
        countdownWrapper.style.display = 'block';
    } else if (data.today > INTERNSHIP_END) {
        todayMessage.innerHTML = `🎉 <strong style="color:var(--green)">ยินดีด้วย!</strong> การฝึกงานเสร็จสิ้นเรียบร้อยแล้ว<br>ฝึกงานครบ <strong style="color:var(--accent-primary)">${data.totalWorkingDays}</strong> วันทำงาน — สุดยอดมาก! 🏆`;
        countdownWrapper.style.display = 'none';
    } else {
        const holiday = isHoliday(data.today);
        const weekend = isWeekend(data.today);

        if (holiday) {
            todayMessage.innerHTML = `🏖️ วันนี้เป็น<strong style="color:var(--red)">วันหยุดราชการ</strong> — ${holiday.name}<br>ฝึกงานไปแล้ว <strong style="color:var(--green)">${data.completedDays}</strong> วัน เหลืออีก <strong style="color:var(--orange)">${data.remainingDays}</strong> วัน`;
        } else if (weekend) {
            todayMessage.innerHTML = `🌟 วันนี้เป็น<strong style="color:var(--text-secondary)">วันหยุดสุดสัปดาห์</strong> — พักผ่อนให้เต็มที่!<br>ฝึกงานไปแล้ว <strong style="color:var(--green)">${data.completedDays}</strong> วัน เหลืออีก <strong style="color:var(--orange)">${data.remainingDays}</strong> วัน`;
        } else {
            todayMessage.innerHTML = `💼 วันนี้เป็น<strong style="color:var(--green)">วันทำงาน</strong> — สู้ ๆ นะ! 💪<br>ฝึกงานไปแล้ว <strong style="color:var(--green)">${data.completedDays}</strong> วัน เหลืออีก <strong style="color:var(--orange)">${data.remainingDays}</strong> วัน`;
        }

        countdownLabel.textContent = '⏰ นับถอยหลังสู่วันสิ้นสุดฝึกงาน';
        countdownGrid.innerHTML = createCountdown(INTERNSHIP_END);
        countdownWrapper.style.display = 'block';
    }
}

function createCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        return '<div class="countdown-item"><span class="countdown-number">0</span><span class="countdown-unit">วัน</span></div>';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `
        <div class="countdown-item">
            <span class="countdown-number">${days}</span>
            <span class="countdown-unit">วัน</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
            <span class="countdown-unit">ชั่วโมง</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
            <span class="countdown-unit">นาที</span>
        </div>
        <div class="countdown-item">
            <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
            <span class="countdown-unit">วินาที</span>
        </div>
    `;
}

function renderCalendars() {
    const container = document.getElementById('calendarsGrid');
    container.innerHTML = '';

    // Months to render: March 2026 to June 2026
    const months = [
        { year: 2026, month: 2 }, // March
        { year: 2026, month: 3 }, // April
        { year: 2026, month: 4 }, // May
        { year: 2026, month: 5 }, // June
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    months.forEach(({ year, month }) => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'calendar-month';

        const title = `${THAI_MONTHS[month]} ${getBuddhistYear(new Date(year, month, 1))}`;
        monthDiv.innerHTML = `<div class="calendar-month-title">${title}</div>`;

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // Day headers (Sun-Sat)
        THAI_DAYS_SHORT.forEach((day, i) => {
            const header = document.createElement('div');
            header.className = `calendar-day-header${i === 0 || i === 6 ? ' weekend-header' : ''}`;
            header.textContent = day;
            grid.appendChild(header);
        });

        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        // Empty cells before month starts
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.textContent = d;

            const inRange = isInInternshipRange(date);
            const weekend = isWeekend(date);
            const holiday = isHoliday(date);
            const isToday = isSameDay(date, today);
            const isPast = date < today;

            if (!inRange) {
                dayDiv.classList.add('outside');
            } else if (isToday) {
                dayDiv.classList.add('today');
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = 'วันนี้';
                dayDiv.appendChild(tooltip);
            } else if (holiday) {
                dayDiv.classList.add(isPast ? 'holiday-completed' : 'holiday');
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = holiday.name;
                dayDiv.appendChild(tooltip);
            } else if (weekend) {
                dayDiv.classList.add('weekend');
            } else if (isPast) {
                dayDiv.classList.add('completed');
            } else {
                dayDiv.classList.add('working');
            }

            grid.appendChild(dayDiv);
        }

        monthDiv.appendChild(grid);
        container.appendChild(monthDiv);
    });
}

function renderHolidays() {
    const container = document.getElementById('holidaysList');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    container.innerHTML = HOLIDAYS.map(h => {
        const isPast = h.date < today;
        const dayName = THAI_DAYS[h.date.getDay()];
        const dateNum = h.date.getDate();
        const monthShort = THAI_MONTHS_SHORT[h.date.getMonth()];

        return `
            <div class="holiday-item ${isPast ? 'past' : ''}">
                <div class="holiday-date-badge">
                    <span class="holiday-date-num">${dateNum}</span>
                    <span class="holiday-date-month">${monthShort}</span>
                </div>
                <div class="holiday-info">
                    <div class="holiday-name">${h.name}</div>
                    <div class="holiday-day">วัน${dayName} — ${h.nameEn}</div>
                </div>
                <span class="holiday-status ${isPast ? 'passed' : 'upcoming'}">
                    ${isPast ? 'ผ่านแล้ว' : 'กำลังมา'}
                </span>
            </div>
        `;
    }).join('');
}

function updateClock() {
    const clock = document.getElementById('liveClock');
    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    clock.textContent = `${dateStr} | ${timeStr}`;
}

// --- Main ---

function init() {
    const data = calculateProgress();

    // Update progress circle
    updateProgressCircle(data.percentage);

    // Animate progress number
    animateNumber(document.getElementById('progressNumber'), Math.round(data.percentage));

    // Update linear progress bar
    updateLinearProgress(data.percentage);

    // Animate stat numbers
    animateNumber(document.getElementById('totalDays'), data.totalWorkingDays);
    animateNumber(document.getElementById('completedDays'), data.completedDays);
    animateNumber(document.getElementById('remainingDays'), data.remainingDays);
    animateNumber(document.getElementById('holidayCount'), data.holidaysInRange);
    animateNumber(document.getElementById('totalWeeks'), data.totalWeeks);
    animateNumber(document.getElementById('currentWeek'), data.currentWeek);

    // Update status
    updateStatus(data);

    // Update today section
    updateTodaySection(data);

    // Render calendars
    renderCalendars();

    // Render holidays
    renderHolidays();

    // Start clock
    updateClock();
    setInterval(updateClock, 1000);

    // Update countdown every second
    setInterval(() => {
        const currentData = calculateProgress();
        updateTodaySection(currentData);
    }, 1000);
}

// Start!
document.addEventListener('DOMContentLoaded', init);
