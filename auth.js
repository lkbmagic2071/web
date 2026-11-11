// ==========================================
// 1. DANH SÁCH TÀI KHOẢN ĐƯỢC CẤP PHÉP NỘI BỘ
// ==========================================
const ALLOWED_USERS = {
    "duadua": {
        pass: "123",
        name: "Bs. Dưa"
    },
    "bacsi_a@gmail.com": {
        pass: "123456",
        name: "Bs. Nguyễn Văn A"
    },
    "kieuoanh": {
        pass: "123",
        name: "HÀ KIỀU OANH"
    }
};

// ==========================================
// 2. KHỞI TẠO VÀ KIỂM TRA TRẠNG THÁI KHI MỞ TRANG
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra xem trình duyệt đã lưu phiên đăng nhập từ trước chưa
    const savedUser = localStorage.getItem("grossMasterUser");
    
    if (savedUser) {
        // Nếu đã đăng nhập trước đó, tự động cập nhật giao diện Navbar
        updateUIAfterLogin(savedUser);
    }

    // Lắng nghe sự kiện click vào tất cả các liên kết bài viết
    const articleLinks = document.querySelectorAll('.sub-link-list a');
    
    articleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Kiểm tra trạng thái hiện tại từ localStorage
            const isLogged = localStorage.getItem("grossMasterLoggedIn");
            if (isLogged !== "true") {
                e.preventDefault();
                openAuthModal("Bạn cần đăng nhập tài khoản chuyên môn được cấp phép để truy cập cẩm nang này.");
            }
        });
    });
});

// ==========================================
// 3. CÁC HÀM XỬ LÝ GIAO DIỆN & ĐĂNG NHẬP
// ==========================================

function openAuthModal(customMessage) {
    const modal = document.getElementById('authModal');
    if (customMessage) {
        const msgElement = document.getElementById('modalMessage');
        if (msgElement) {
            msgElement.innerText = customMessage;
        }
    }
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
    const passInput = document.getElementById('loginPassword');
    if (passInput) passInput.value = '';
}

// Xử lý Đăng Nhập
function handleLogin() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!");
        return;
    }

    const userAccount = ALLOWED_USERS[username];

    if (userAccount && userAccount.pass === password) {
        // LƯU TRẠNG THÁI VÀO BỘ NHỚ TRÌNH DUYỆT (Lưu vĩnh viễn cho đến khi Đăng xuất)
        localStorage.setItem("grossMasterLoggedIn", "true");
        localStorage.setItem("grossMasterUser", userAccount.name);

        // Cập nhật giao diện
        updateUIAfterLogin(userAccount.name);
        closeAuthModal();
        alert("Đăng nhập thành công! Xin chào " + userAccount.name);
    } else {
        alert("Mã bác sĩ hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
    }
}

// Hàm hỗ trợ cập nhật giao diện Navbar khi đã đăng nhập
function updateUIAfterLogin(userName) {
    const userStatus = document.getElementById('userStatus');
    if (userStatus) {
        userStatus.innerText = "Xin chào, " + userName;
        userStatus.style.color = "#2dd4bf";
    }

    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.innerText = "Đăng Xuất";
        authBtn.style.background = "#ef4444";
        authBtn.setAttribute("onclick", "handleLogout()");
    }
}

// Xử lý Đăng Xuất (Xóa bộ nhớ lưu trữ)
function handleLogout() {
    // Xóa trạng thái lưu trong trình duyệt
    localStorage.removeItem("grossMasterLoggedIn");
    localStorage.removeItem("grossMasterUser");

    // Reset giao diện Navbar về trạng thái chưa đăng nhập
    const userStatus = document.getElementById('userStatus');
    if (userStatus) {
        userStatus.innerText = "Chưa đăng nhập";
        userStatus.style.color = "#99f6e4";
    }

    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.innerText = "Đăng Nhập";
        authBtn.style.background = "#14b8a6";
        authBtn.setAttribute("onclick", "openAuthModal()");
    }

    alert("Bạn đã đăng xuất khỏi hệ thống.");
}