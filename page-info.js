/* page-info.js — botón ⓘ con una breve descripción de cada página.
   Se incluye después de auth.js en cada página. Detecta el archivo actual,
   inserta un botón junto al título (<h1>) y muestra un popover pequeño
   arriba a un costado. Los estilos son autocontenidos (no dependen del
   CSS de cada página). */
(function () {
  "use strict";

  var DESCRIPCIONES = {
    "index.html": {
      titulo: "Menú principal",
      texto: "Punto de entrada al sistema. Desde aquí accedes a ingreso, salida, dashboards y administración según tu rol."
    },
    "ingreso-cst.html": {
      titulo: "Ingreso de moto",
      texto: "Registra la entrada de una moto al taller: placa, cliente, tipo de servicio, técnico asignado y valor estimado. Avisa si la placa ya tiene un ingreso abierto."
    },
    "salida-cst.html": {
      titulo: "Salida de moto",
      texto: "Cierra un ingreso cuando la moto se entrega: valor final, upsell, cumplimiento de la entrega y comentarios. Calcula el tiempo en taller."
    },
    "corregir.html": {
      titulo: "Solicitar corrección",
      texto: "Pide corregir un dato de un ingreso o salida ya guardado. La solicitud queda pendiente hasta que un manager la apruebe."
    },
    "correcciones.html": {
      titulo: "Solicitudes de corrección",
      texto: "Bandeja de correcciones pendientes. Manager y developer revisan, aprueban o rechazan; al aprobar, el cambio se aplica al registro real."
    },
    "dashboard-cst.html": {
      titulo: "Tablero del taller",
      texto: "Vista general de la operación en tiempo real: motos en taller, entradas y salidas del día e indicadores clave."
    },
    "dashboard-admin.html": {
      titulo: "Rendimiento del equipo",
      texto: "Métricas por técnico y del taller: volumen, cumplimiento de entregas y upsell para seguimiento gerencial."
    },
    "dashboard-tecnico.html": {
      titulo: "Mi taller",
      texto: "Vista del técnico: las motos que tiene asignadas y su estado actual."
    },
    "reset-usuarios.html": {
      titulo: "Resetear contraseñas",
      texto: "Solo developer. Habilita a un usuario para definir una clave nueva en su próximo login, sin necesidad de una clave temporal."
    },
    "agente-cst.html": {
      titulo: "Agente IA",
      texto: "Asistente que responde preguntas en lenguaje natural sobre los datos del taller."
    }
  };

  function archivoActual() {
    var p = location.pathname.split("/").pop();
    return p || "index.html";
  }

  function inyectarEstilos() {
    if (document.getElementById("page-info-styles")) return;
    var css =
      ".page-info-btn{display:inline-flex;align-items:center;justify-content:center;" +
      "width:20px;height:20px;margin-left:10px;padding:0;vertical-align:middle;" +
      "border:1.5px solid #C9A84C;border-radius:50%;background:transparent;" +
      "color:#C9A84C;font:700 12px/1 'Inter','Segoe UI',system-ui,sans-serif;" +
      "cursor:pointer;flex-shrink:0;transition:background .15s,color .15s;}" +
      ".page-info-btn:hover{background:#C9A84C;color:#1A1A1A;}" +
      ".page-info-pop{position:fixed;z-index:9998;max-width:280px;width:calc(100vw - 24px);" +
      "background:#242424;border:1px solid #3A3A3A;border-radius:10px;" +
      "padding:14px 16px;box-shadow:0 8px 28px rgba(0,0,0,.45);" +
      "font-family:'Inter','Segoe UI',system-ui,sans-serif;" +
      "opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .15s,transform .15s;}" +
      ".page-info-pop.show{opacity:1;transform:translateY(0);pointer-events:auto;}" +
      ".page-info-pop strong{display:block;color:#C9A84C;font-size:13px;font-weight:700;margin-bottom:6px;}" +
      ".page-info-pop p{margin:0;color:#F0F0F0;font-size:13px;line-height:1.5;}";
    var st = document.createElement("style");
    st.id = "page-info-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function init() {
    var info = DESCRIPCIONES[archivoActual()];
    if (!info) return;
    var h1 = document.querySelector(".header h1") || document.querySelector("h1");
    if (!h1 || h1.querySelector(".page-info-btn")) return;

    inyectarEstilos();

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "page-info-btn";
    btn.textContent = "i";
    btn.setAttribute("aria-label", "Información de esta página");
    btn.setAttribute("aria-expanded", "false");
    h1.appendChild(btn);

    var pop = document.createElement("div");
    pop.className = "page-info-pop";
    pop.setAttribute("role", "tooltip");
    var t = document.createElement("strong");
    t.textContent = info.titulo;
    var p = document.createElement("p");
    p.textContent = info.texto;
    pop.appendChild(t);
    pop.appendChild(p);
    document.body.appendChild(pop);

    function posicionar() {
      var r = btn.getBoundingClientRect();
      var ancho = pop.offsetWidth;
      var left = Math.min(r.right - ancho, window.innerWidth - ancho - 12);
      if (left < 12) left = 12;
      pop.style.left = left + "px";
      pop.style.top = (r.bottom + 8) + "px";
    }

    function abrir() {
      pop.classList.add("show");
      btn.setAttribute("aria-expanded", "true");
      posicionar();
    }
    function cerrar() {
      pop.classList.remove("show");
      btn.setAttribute("aria-expanded", "false");
    }
    function estaAbierto() { return pop.classList.contains("show"); }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      estaAbierto() ? cerrar() : abrir();
    });
    document.addEventListener("click", function (e) {
      if (estaAbierto() && !pop.contains(e.target)) cerrar();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrar();
    });
    window.addEventListener("resize", cerrar);
    window.addEventListener("scroll", cerrar, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
