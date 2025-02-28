document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.nav-slider');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentPage = 0;
    const totalPages = 2; // 总页数

    function updateNavigation() {
        // 更新箭头状态
        leftArrow.style.display = currentPage <= 0 ? 'none' : 'block';
        rightArrow.style.display = currentPage >= totalPages - 1 ? 'none' : 'block';
        
        // 计算滑动距离（基于页面宽度1920px）
        const offset = currentPage * 1920;
        slider.style.transform = `translateX(-${offset}px)`;
    }

    // 右箭头点击事件
    rightArrow.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateNavigation();
        }
    });

    // 左箭头点击事件
    leftArrow.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateNavigation();
        }
    });

    // 初始化导航状态
    updateNavigation();
});