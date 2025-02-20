// 搜索图标点击事件
document.querySelector('.search-icon').addEventListener('click', function() {
  console.log('触发搜索功能');
});

// 按钮悬停效果增强
document.querySelectorAll('.nav-links button').forEach(button => {
  button.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-2px) scale(1.05)';
  });
  
  button.addEventListener('mouseout', function() {
      this.style.transform = 'translateY(0) scale(1)';
  });
});

// 轮播功能
function initCarousel() {
  const slides = document.querySelectorAll('.banner-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  
  function showNextSlide() {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
  }

  let carouselTimer = setInterval(showNextSlide, 5000);
  const container = document.querySelector('.banner-container');
  
  container.addEventListener('mouseenter', () => clearInterval(carouselTimer));
  container.addEventListener('mouseleave', () => {
      carouselTimer = setInterval(showNextSlide, 5000);
  });
}

// 图片点击事件
document.querySelectorAll('.clickable-img').forEach(img => {
  img.addEventListener('click', function() {
      console.log('点击图片：', this.alt);
  });
});

// 文字点击事件
document.querySelectorAll('.clickable-text').forEach(text => {
  text.addEventListener('click', function() {
      console.log('点击文字：', this.textContent);
  });
});

// 下拉菜单功能（保留新增部分）
document.querySelectorAll('.dropdown-container').forEach(container => {
  let timeout;
  
  container.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      container.classList.add('active');
  });
  
  container.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
          container.classList.remove('active');
      }, 200);
  });
});

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
      item.style.color = '#007bff';
  });
  
  item.addEventListener('mouseleave', () => {
      item.style.color = 'white';
  });
});

// 初始化
document.addEventListener('DOMContentLoaded', initCarousel);