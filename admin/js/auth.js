/* =========================================================
   DARIUSH MADAN AZAR — ADMIN AUTH (CLIENT-SIDE ONLY)
   ---------------------------------------------------------
   IMPORTANT: This is a lightweight passcode gate meant to keep
   casual visitors out of the admin panel while the site has no
   backend. It is NOT real security — anyone who reads the JS
   source can bypass it. Before putting real/sensitive company
   data behind this panel, replace this with a proper
   server-side login (see README.md "Future Upgrade Path").
   ========================================================= */

const DMA_SESSION_KEY = 'dma_admin_authed';

function dmaCheckSession(){
  return sessionStorage.getItem(DMA_SESSION_KEY) === 'true';
}

function dmaShowAdmin(){
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminShell').classList.add('show');
  if (typeof dmaInitAdmin === 'function') dmaInitAdmin();
}

document.addEventListener('DOMContentLoaded', () => {
  if (dmaCheckSession()){ dmaShowAdmin(); return; }

  const form = document.getElementById('loginForm');
  const err = document.getElementById('loginErr');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('loginPass').value.trim();
    if (DMA_DB.checkPassword(pass)){
      sessionStorage.setItem(DMA_SESSION_KEY, 'true');
      err.textContent = '';
      dmaShowAdmin();
    } else {
      err.textContent = 'رمز عبور نادرست است.';
    }
  });
});

function dmaLogout(){
  sessionStorage.removeItem(DMA_SESSION_KEY);
  location.reload();
}
