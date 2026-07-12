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
