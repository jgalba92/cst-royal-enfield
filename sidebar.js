/* sidebar.js — sidebar de navegación desplegable para admin/manager/developer.
   Incluir DESPUÉS de auth.js en dashboard-admin.html y dashboard-cst.html.
   No aplica a técnico (no tiene acceso a estas páginas) ni cambia el flujo
   de index.html/vendedor. Colapsado por defecto (solo íconos), se expande
   con hover o click en desktop; en móvil es un menú hamburguesa off-canvas. */
(function () {
  "use strict";

  var COLOR = {
    panel: "#242424", panel2: "#2E2E2E", line: "#3A3A3A",
    ink: "#F0F0F0", muted: "#888", red: "#C8102E", gold: "#C9A84C",
  };

  var ICONS = {
    taller: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    datos: '<path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5" rx="0.5"/><rect x="12" y="9" width="3" height="9" rx="0.5"/><rect x="17" y="5" width="3" height="13" rx="0.5"/>',
    ia: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    correcciones: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    contrasenas: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  };

  var ITEMS = [
    { key: "taller",       label: "Taller",              href: "dashboard-admin.html", roles: ["admin", "manager", "developer"] },
    { key: "datos",        label: "Dashboard Gerencial", href: "dashboard-cst.html",   roles: ["admin", "manager", "developer"] },
    { key: "ia",           label: "Asistente IA",        href: "agente-cst.html",      roles: ["admin", "manager", "developer"] },
    { key: "correcciones", label: "Correcciones",        href: "correcciones.html",    roles: ["manager", "developer"] },
    { key: "contrasenas",  label: "Contraseñas",         href: "reset-usuarios.html",  roles: ["developer"] },
  ];

  function svg(nombre) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + ICONS[nombre] + '</svg>';
  }

  function archivoActual() {
    var p = location.pathname.split("/").pop();
    return p || "index.html";
  }

  function inyectarEstilos() {
    if (document.getElementById("cst-sidebar-styles")) return;
    var css =
      "#cst-sb{position:fixed;top:0;left:0;height:100vh;width:60px;background:" + COLOR.panel + ";" +
        "border-right:1px solid " + COLOR.line + ";display:flex;flex-direction:column;z-index:9990;" +
        "transition:width .18s ease;overflow:hidden;font-family:'Inter','Segoe UI',system-ui,sans-serif;}" +
      "#cst-sb:hover,#cst-sb.cst-sb-open{width:216px;}" +
      "#cst-sb-toggle{background:none;border:none;color:" + COLOR.muted + ";cursor:pointer;" +
        "width:60px;height:52px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}" +
      "#cst-sb-toggle:hover{color:" + COLOR.ink + ";}" +
      "#cst-sb-toggle svg{width:20px;height:20px;}" +
      ".cst-sb-items{flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 0;display:flex;flex-direction:column;gap:2px;}" +
      ".cst-sb-item{display:flex;align-items:center;gap:14px;height:44px;padding:0 18px;" +
        "color:" + COLOR.muted + ";text-decoration:none;white-space:nowrap;border:none;background:none;" +
        "font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;width:100%;text-align:left;" +
        "border-left:3px solid transparent;flex-shrink:0;}" +
      ".cst-sb-item:hover{color:" + COLOR.ink + ";background:" + COLOR.panel2 + ";}" +
      ".cst-sb-item.active{color:" + COLOR.gold + ";border-left-color:" + COLOR.gold + ";background:" + COLOR.panel2 + ";}" +
      ".cst-sb-item svg{width:20px;height:20px;flex-shrink:0;}" +
      ".cst-sb-item span{opacity:0;transition:opacity .12s;}" +
      "#cst-sb:hover .cst-sb-item span,#cst-sb.cst-sb-open .cst-sb-item span{opacity:1;}" +
      ".cst-sb-bottom{border-top:1px solid " + COLOR.line + ";padding:6px 0;flex-shrink:0;}" +
      ".cst-sb-bottom .cst-sb-item:hover{color:#ff6b6b;}" +
      "#cst-sb-fab{display:none;position:fixed;bottom:24px;left:24px;z-index:9991;" +
        "width:52px;height:52px;border-radius:50%;background:" + COLOR.panel + ";border:1px solid " + COLOR.line + ";" +
        "color:" + COLOR.ink + ";align-items:center;justify-content:center;cursor:pointer;" +
        "box-shadow:0 4px 16px rgba(0,0,0,.4);}" +
      "#cst-sb-fab svg{width:22px;height:22px;}" +
      "#cst-sb-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9989;}" +
      "@media (max-width:768px){" +
        "#cst-sb{transform:translateX(-100%);width:230px;transition:transform .2s ease;}" +
        "#cst-sb.cst-sb-open{transform:translateX(0);width:230px;}" +
        "#cst-sb:hover{width:230px;}" +
        "#cst-sb .cst-sb-item span{opacity:1;}" +
        "#cst-sb-toggle{display:none;}" +
        "#cst-sb-fab{display:flex;}" +
      "}" +
      "@media (prefers-reduced-motion:reduce){#cst-sb,#cst-sb *{transition:none!important;}}";
    var st = document.createElement("style");
    st.id = "cst-sidebar-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function init() {
    var s = typeof getSession === "function" ? getSession() : null;
    if (!s) return;
    var rol = s.rol || s.role;
    var items = ITEMS.filter(function (it) { return it.roles.indexOf(rol) !== -1; });
    if (!items.length) return;

    inyectarEstilos();
    var actual = archivoActual();

    var nav = document.createElement("nav");
    nav.id = "cst-sb";
    nav.setAttribute("aria-label", "Navegación principal");

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.id = "cst-sb-toggle";
    toggleBtn.setAttribute("aria-label", "Expandir o colapsar menú");
    toggleBtn.innerHTML = svg("menu");
    nav.appendChild(toggleBtn);

    var itemsWrap = document.createElement("div");
    itemsWrap.className = "cst-sb-items";
    items.forEach(function (it) {
      var a = document.createElement("a");
      a.className = "cst-sb-item" + (it.href === actual ? " active" : "");
      a.href = it.href;
      a.innerHTML = svg(it.key) + "<span>" + it.label + "</span>";
      itemsWrap.appendChild(a);
    });
    nav.appendChild(itemsWrap);

    var bottom = document.createElement("div");
    bottom.className = "cst-sb-bottom";
    var logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "cst-sb-item";
    logoutBtn.innerHTML = svg("salir") + "<span>Salir</span>";
    logoutBtn.addEventListener("click", function () {
      if (typeof logout === "function") logout();
    });
    bottom.appendChild(logoutBtn);
    nav.appendChild(bottom);

    var backdrop = document.createElement("div");
    backdrop.id = "cst-sb-backdrop";

    var fab = document.createElement("button");
    fab.type = "button";
    fab.id = "cst-sb-fab";
    fab.setAttribute("aria-label", "Abrir menú");
    fab.innerHTML = svg("menu");

    function abrirMovil() {
      nav.classList.add("cst-sb-open");
      backdrop.style.display = "block";
      fab.innerHTML = svg("close");
    }
    function cerrarMovil() {
      nav.classList.remove("cst-sb-open");
      backdrop.style.display = "none";
      fab.innerHTML = svg("menu");
    }
    fab.addEventListener("click", function () {
      if (nav.classList.contains("cst-sb-open")) cerrarMovil(); else abrirMovil();
    });
    backdrop.addEventListener("click", cerrarMovil);
    itemsWrap.addEventListener("click", cerrarMovil);

    // En desktop, el toggle fija el menú expandido (click) además del hover.
    toggleBtn.addEventListener("click", function () {
      nav.classList.toggle("cst-sb-open");
    });

    document.body.appendChild(nav);
    document.body.appendChild(backdrop);
    document.body.appendChild(fab);
    document.body.classList.add("cst-has-sidebar");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
