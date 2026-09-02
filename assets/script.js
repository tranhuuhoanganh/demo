
const products = [
  { id: 1, name: "Khăn lụa họa tiết Sen Việt", category: "fashion", label: "THỜI TRANG", price: 389000, motif: "lotus", bg: "#8c4d3d", badge: "Bán chạy" },
  { id: 2, name: "Túi tote Chim Lạc", category: "accessory", label: "PHỤ KIỆN", price: 259000, motif: "drum", bg: "#405544", badge: "Mới" },
  { id: 3, name: "Sổ tay Vân Mây", category: "gift", label: "QUÀ TẶNG", price: 149000, motif: "cloud", bg: "#d6c2a2", badge: "" },
  { id: 4, name: "Bình giữ nhiệt Đông Sơn", category: "home", label: "ĐỒ DÙNG", price: 329000, motif: "drum", bg: "#a24f37", badge: "" },
  { id: 5, name: "Áo thun Dấu Ấn Việt", category: "fashion", label: "THỜI TRANG", price: 419000, motif: "cloud", bg: "#59685a", badge: "Limited" },
  { id: 6, name: "Ví vải họa tiết Sen", category: "accessory", label: "PHỤ KIỆN", price: 219000, motif: "lotus", bg: "#bd7559", badge: "" },
  { id: 7, name: "Hộp quà Di Sản", category: "gift", label: "QUÀ TẶNG", price: 549000, motif: "drum", bg: "#2f4035", badge: "Quà tặng" },
  { id: 8, name: "Ly sứ Vân Cổ", category: "home", label: "ĐỒ DÙNG", price: 189000, motif: "cloud", bg: "#b69062", badge: "" }
];
let cart = JSON.parse(localStorage.getItem("heritage-cart") || "[]");
let currentFilter = "all";
let searchTerm = "";

function formatPrice(v){ return new Intl.NumberFormat("vi-VN").format(v) + "đ"; }
function motifClass(m){ return m==="lotus"?"motif-lotus":m==="cloud"?"motif-cloud":"motif-drum"; }
function cardHTML(p){return `
<article class="product-card">
  <div class="product-image" style="background:${p.bg}">
    ${p.badge?`<span class="product-badge">${p.badge}</span>`:""}
    <div class="motif ${motifClass(p.motif)}"></div>
  </div>
  <div class="product-info">
    <span class="product-category">${p.label}</span>
    <h3>${p.name}</h3>
    <div class="product-price"><strong>${formatPrice(p.price)}</strong><button class="add-cart" data-id="${p.id}">+</button></div>
  </div>
</article>`}

function bindAddButtons(){
  document.querySelectorAll(".add-cart").forEach(btn=>btn.onclick=()=>addToCart(Number(btn.dataset.id)));
}
function renderShop(){
  const grid=document.getElementById("productGrid"); if(!grid) return;
  const filtered=products.filter(p=>(currentFilter==="all"||p.category===currentFilter)&&p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  grid.innerHTML=filtered.map(cardHTML).join("");
  const empty=document.getElementById("emptyState"); if(empty) empty.style.display=filtered.length?"none":"block";
  bindAddButtons();
}
function renderFeatured(){
  const grid=document.getElementById("featuredGrid"); if(!grid) return;
  grid.innerHTML=products.slice(0,4).map(cardHTML).join(""); bindAddButtons();
}
function addToCart(id){ const p=products.find(x=>x.id===id); cart.push(p); saveCart(); renderCart(); toast(`Đã thêm “${p.name}” vào giỏ`); }
function removeCart(i){ cart.splice(i,1); saveCart(); renderCart(); }
function saveCart(){localStorage.setItem("heritage-cart",JSON.stringify(cart));}
function renderCart(){
  const count=document.getElementById("cartCount"); if(count) count.textContent=cart.length;
  const total=document.getElementById("cartTotal"); if(total) total.textContent=formatPrice(cart.reduce((s,p)=>s+p.price,0));
  const list=document.getElementById("cartItems"); if(!list) return;
  if(!cart.length){list.innerHTML='<div class="cart-empty">Giỏ hàng đang trống.</div>'; return;}
  list.innerHTML=cart.map((p,i)=>`<div class="cart-item"><div class="cart-thumb" style="background:${p.bg}"></div><div><h4>${p.name}</h4><p>${formatPrice(p.price)}</p></div><button data-i="${i}">×</button></div>`).join("");
  list.querySelectorAll("button").forEach(b=>b.onclick=()=>removeCart(Number(b.dataset.i)));
}
function toast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
function setupCart(){
  const drawer=document.getElementById("cartDrawer"), overlay=document.getElementById("overlay");
  const open=()=>{drawer?.classList.add("open");overlay?.classList.add("show")};
  const close=()=>{drawer?.classList.remove("open");overlay?.classList.remove("show")};
  document.getElementById("openCart")?.addEventListener("click",open);
  document.getElementById("closeCart")?.addEventListener("click",close);
  overlay?.addEventListener("click",close);
  document.getElementById("checkoutBtn")?.addEventListener("click",()=>toast("Thanh toán hiện chưa được tích hợp."));
}
function setupNav(){
  const page=document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach(a=>{if(a.dataset.nav===page)a.classList.add("active")});
  const menu=document.getElementById("mobileMenu");
  document.getElementById("menuButton")?.addEventListener("click",()=>menu?.classList.toggle("open"));
}
function setupShop(){
  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active"); currentFilter=btn.dataset.filter; renderShop();
  }));
  document.getElementById("searchInput")?.addEventListener("input",e=>{searchTerm=e.target.value.trim();renderShop();});
}
function setupForms(){
  document.getElementById("contactForm")?.addEventListener("submit",e=>{e.preventDefault();toast("Đã gửi liên hệ demo.");e.target.reset();});
  document.querySelectorAll(".demo-action").forEach(b=>b.addEventListener("click",()=>toast("Tính năng này mới ở mức giao diện demo.")));
}
setupNav(); setupCart(); setupShop(); setupForms(); renderFeatured(); renderShop(); renderCart();


document.documentElement.classList.add("js-ready");
window.addEventListener("DOMContentLoaded",()=>{
  document.body.animate(
    [{opacity:0, transform:"translateY(6px)"},{opacity:1, transform:"translateY(0)"}],
    {duration:420,easing:"cubic-bezier(.22,.8,.2,1)"}
  );
  let last=window.scrollY;
  const header=document.querySelector(".header");
  window.addEventListener("scroll",()=>{
    const y=window.scrollY;
    if(header){
      header.style.boxShadow = y>12 ? "0 10px 30px rgba(20,24,20,.06)" : "none";
    }
    last=y;
  },{passive:true});
});
