// 搜索图标点击事件
document.querySelector('.search-icon').addEventListener('click', function() {
  // 在这里添加搜索功能逻辑
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
  if (slides.length <= 1) return; // 单图不启用轮播

  let currentIndex = 0;
  
  function showNextSlide() {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
  }

  // 自动轮播
  let carouselTimer = setInterval(showNextSlide, 5000);

  // 悬停暂停
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

<<<<<<< HEAD
//下拉框
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

// 保持与其他导航按钮的样式统一
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
      item.style.color = '#007bff';
  });
  
  item.addEventListener('mouseleave', () => {
      item.style.color = 'white';
  });
});

=======
>>>>>>> 78a652e89b9cfbb66fbfc6c309fc0a19ca5ce131

// 初始化
document.addEventListener('DOMContentLoaded', initCarousel);