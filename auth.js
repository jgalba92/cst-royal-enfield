/* auth.js — sesión JWT compartida para todas las páginas.
   Incluir en <head> antes de cualquier llamada a guard/authFetch/logout. */

/* Lee la sesión guardada: { token, rol, tecnico } o null. */
function getSession(){
  try{
    return JSON.parse(sessionStorage.getItem("cst_session") || "null");
  }catch(e){
    return null;
  }
}

/* Cierra sesión: borra el token y vuelve al login. */
function logout(){
  sessionStorage.removeItem("cst_session");
  location.replace("login.html");
}

/* fetch con el header Authorization: Bearer <token>.
   Si el Worker responde 401 (token vencido) cierra sesión. */
async function authFetch(url, options){
  options = options || {};
  var s = getSession();
  var headers = Object.assign({}, options.headers || {});
  if(s && s.token){
    headers["Authorization"] = "Bearer " + s.token;
  }
  var res = await fetch(url, Object.assign({}, options, { headers: headers }));
  if(res.status === 401){
    logout();
    throw new Error("Sesión vencida (401)");
  }
  return res;
}

/* Guard de página: si no hay sesión o el rol no está permitido -> login.
   Devuelve la sesión para uso posterior. */
function guard(rolesPermitidos){
  var s = getSession();
  if(!s || !s.role && !s.rol){
    location.replace("login.html");
    return null;
  }
  var rol = s.rol || s.role;
  if(rolesPermitidos && rolesPermitidos.indexOf(rol) === -1){
    location.replace("login.html");
    return null;
  }
  return s;
}

/* "Ver como": el manager guarda su sesion real en cst_session_real e impersona
   otro rol. volverAManager restaura la sesion real y limpia el flag. */
function volverAManager(){
  var real = sessionStorage.getItem("cst_session_real");
  if(real){
    sessionStorage.setItem("cst_session", real);
    sessionStorage.removeItem("cst_session_real");
  }
  location.href = "index.html";
}

/* Si hay una sesion real guardada, mostramos una franja fija en todas las
   paginas para poder volver al manager. Se inserta al cargar el body. */
function mostrarBannerImpersonacion(){
  if(!sessionStorage.getItem("cst_session_real")) return;
  if(document.getElementById("impersonation-bar")) return;
  var s = getSession() || {};
  var etiqueta = s.tecnico || s.rol || s.role || "usuario";

  var bar = document.createElement("div");
  bar.id = "impersonation-bar";
  bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;" +
    "background:#C9A84C;color:#1A1A1A;" +
    "font-family:'Inter','Segoe UI',system-ui,sans-serif;font-size:13px;font-weight:600;" +
    "padding:8px 16px;display:flex;align-items:center;justify-content:center;gap:14px;" +
    "box-shadow:0 1px 6px rgba(0,0,0,.4)";

  var txt = document.createElement("span");
  txt.textContent = "Viendo como " + etiqueta;

  var real = {};
  try{ real = JSON.parse(sessionStorage.getItem("cst_session_real") || "{}"); }catch(e){}
  var realRol = real.rol || real.role || "manager";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Volver a " + realRol;
  btn.style.cssText = "background:#1A1A1A;color:#F0F0F0;border:none;border-radius:6px;" +
    "padding:6px 12px;font:inherit;font-weight:600;cursor:pointer";
  btn.addEventListener("click", volverAManager);

  bar.appendChild(txt);
  bar.appendChild(btn);
  document.body.appendChild(bar);

  // empuja el contenido para que la franja no lo tape
  var cur = parseInt(getComputedStyle(document.body).paddingTop, 10) || 0;
  document.body.style.paddingTop = (cur + bar.offsetHeight) + "px";
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", mostrarBannerImpersonacion);
}else{
  mostrarBannerImpersonacion();
}
