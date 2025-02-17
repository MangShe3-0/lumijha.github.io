// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // 移动端菜单切换
    const navElement = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    // 自动添加激活状态
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.nav-links a.active')?.classList.remove('active');
            link.classList.add('active');
            // 实际项目中此处应添加页面切换逻辑
        });
    });

    // 视口变化监听
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        }
    });
});

//轮播
// JavaScript 控制
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// 自动播放
let autoPlay = setInterval(nextSlide, 5000);

// 可选：暂停播放当鼠标悬停
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
  clearInterval(autoPlay);
});

document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
  autoPlay = setInterval(nextSlide, 5000);
});