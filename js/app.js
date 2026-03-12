/**
 * app.js — Lógica de navegación y comportamiento interactivo
 * Stack: jQuery 3.7 + HTML5 + CSS3 puro
 */

// Si corre como app nativa (Capacitor), quitamos el marco de teléfono
if (window.Capacitor && window.Capacitor.isNativePlatform()) {
  document.documentElement.classList.add('native-app');
}

$(function () {

  /* ═══════════════════════════════════════════════════════
     NAVEGACIÓN ENTRE PANTALLAS
     ═══════════════════════════════════════════════════════ */

  /**
   * Navega a una pantalla por su ID.
   * @param {string} targetId  — ID del elemento .screen destino
   */
  function goTo(targetId) {
    const $current = $('.screen.active');
    const $target  = $('#' + targetId);

    if (!$target.length || $target.hasClass('active')) return;

    // Salida de la pantalla actual
    $current.addClass('slide-out');

    // Pequeño delay para que se vea la animación de salida
    setTimeout(function () {
      $current.removeClass('active slide-out');
      $target.addClass('active');
    }, 200);
  }

  /* ── Botón LOGIN ─────────────────────────────────────── */
  $('#btnLogin').on('click', function () {
    const email = $('#inputEmail').val().trim();
    const pwd   = $('#inputPwd').val().trim();

    if (!email || !pwd) {
      showToast('Completa todos los campos');
      return;
    }
    goTo('screenHome');
  });

  /* ── Olvidé contraseña ──────────────────────────────── */
  $('#linkForgot').on('click', function (e) {
    e.preventDefault();
    showToast('Se envió un correo de recuperación');
  });

  /* ── Mostrar/ocultar contraseña ─────────────────────── */
  $('#btnEye').on('click', function () {
    const $input = $('#inputPwd');
    if ($input.attr('type') === 'password') {
      $input.attr('type', 'text');
      $(this).text('🙈');
    } else {
      $input.attr('type', 'password');
      $(this).text('👁');
    }
  });

  /* ── Crear nueva alarma (desde Home) ────────────────── */
  $('#btnNuevaAlarma').on('click', function () {
    showToast('Función en desarrollo');
  });

  /* ── Editar alarma (desde Home) ─────────────────────── */
  $('#linkEditHome').on('click', function (e) {
    e.preventDefault();
    showToast('Editando alarma…');
  });

  /* ── Nav inferior: botones con data-screen ──────────── */
  $(document).on('click', '.nav-btn[data-screen]', function () {
    const target = $(this).data('screen');
    if (target) goTo(target);
  });

  /* ── Menú Preferencias: items ────────────────────────── */
  $('#menuSonidos').on('click', function () {
    goTo('screenSonidos');
  });

  $('#menuVoz').on('click', function () {
    goTo('screenVoz');
  });

  $('#menuLaborales').on('click', function () {
    goTo('screenLaborales');
  });

  /* ── Volver desde sub-pantallas ──────────────────────── */
  $('#btnBackSonidos, #btnCancelSonidos').on('click', function () {
    goTo('screenPreferencias');
  });

  $('#btnBackVoz, #btnCancelVoz').on('click', function () {
    goTo('screenPreferencias');
  });

  $('#btnBackLaborales, #btnCancelLaborales').on('click', function () {
    goTo('screenPreferencias');
  });

  /* ── Guardar Sonidos ─────────────────────────────────── */
  $('#btnSaveSonidos').on('click', function () {
    const selected = $('input[name="sonido"]:checked').val() || 'suave';
    const vol      = $('#sliderSonidos').val();
    showToast('Sonido guardado: ' + selected + ' — ' + vol + '%');
    goTo('screenPreferencias');
  });

  /* ── Guardar Voz ─────────────────────────────────────── */
  $('#btnSaveVoz').on('click', function () {
    showToast('Configuración de voz guardada');
    goTo('screenPreferencias');
  });

  /* ── Guardar Laborales ───────────────────────────────── */
  $('#btnSaveLaborales').on('click', function () {
    showToast('Días laborales guardados');
    goTo('screenPreferencias');
  });

  /* ── Probar voz ──────────────────────────────────────── */
  $('#btnProbarVoz').on('click', function () {
    showToast('Escuchando… di "OK alarma, apaga"');
  });


  /* ═══════════════════════════════════════════════════════
     RADIO CARDS (Sonidos) — sincronización estado visual
     ═══════════════════════════════════════════════════════ */
  $(document).on('change', '#radioSonidos input[type="radio"]', function () {
    // Quitar estilo seleccionado a todos
    $('#radioSonidos .radio-card').removeClass('radio-card-selected');
    // Añadir al padre label del input activo
    $(this).closest('.radio-card').addClass('radio-card-selected');
  });


  /* ═══════════════════════════════════════════════════════
     RADIO PLAIN — sincronización estado visual (.radio-dot)
     ═══════════════════════════════════════════════════════ */
  $(document).on('change', '.radio-plain-list input[type="radio"]', function () {
    const name = $(this).attr('name');
    // Resetear todos del mismo grupo
    $('input[name="' + name + '"]').closest('.radio-plain').removeClass('radio-checked');
    // Marcar el activo
    $(this).closest('.radio-plain').addClass('radio-checked');
    // Actualizar punto visual
    syncRadioDots(name);
  });

  function syncRadioDots(groupName) {
    $('input[name="' + groupName + '"]').each(function () {
      const $dot = $(this).closest('.radio-plain').find('.radio-dot');
      if ($(this).is(':checked')) {
        $dot.css({
          'border-color': 'var(--c-link)',
          'background':   'var(--c-link)',
          'box-shadow':   'inset 0 0 0 3px #fff'
        });
      } else {
        $dot.css({
          'border-color': 'var(--c-outline-bd)',
          'background':   '#fff',
          'box-shadow':   'none'
        });
      }
    });
  }

  // Inicializar puntos radio en pantalla visible
  function initAllRadioDots() {
    ['sonido', 'sensibilidad', 'fuente', 'regla', 'efecto'].forEach(function (g) {
      syncRadioDots(g);
    });
  }


  /* ═══════════════════════════════════════════════════════
     SLIDERS DE VOLUMEN — actualizar porcentaje en tiempo real
     ═══════════════════════════════════════════════════════ */
  $('#sliderSonidos').on('input', function () {
    $('#pctSonidos').text($(this).val() + '%');
    updateSliderFill(this);
  });

  $('#sliderVoz').on('input', function () {
    $('#pctVoz').text($(this).val() + '%');
    updateSliderFill(this);
  });

  function updateSliderFill(sliderEl) {
    const val = sliderEl.value;
    const pct = ((val - sliderEl.min) / (sliderEl.max - sliderEl.min)) * 100;
    $(sliderEl).css('background',
      'linear-gradient(to right, var(--c-primary) ' + pct + '%, var(--c-border) ' + pct + '%)'
    );
  }

  // Inicializar colores de slider
  function initSliders() {
    document.querySelectorAll('.vol-range').forEach(function (el) {
      updateSliderFill(el);
    });
  }


  /* ═══════════════════════════════════════════════════════
     RELOJ EN TIEMPO REAL (top bars)
     ═══════════════════════════════════════════════════════ */
  function updateClocks() {
    const now = new Date();
    const h   = String(now.getHours()).padStart(2, '0');
    const m   = String(now.getMinutes()).padStart(2, '0');
    const timeStr = h + ':' + m;
    $('#topBarTimeHome, #topBarTimePref').text(timeStr);
  }

  updateClocks();
  setInterval(updateClocks, 30000);


  /* ═══════════════════════════════════════════════════════
     TOAST NOTIFICATIONS
     ═══════════════════════════════════════════════════════ */
  let _toastTimer = null;

  function showToast(msg, duration) {
    duration = duration || 2400;
    const $t = $('#toast');
    clearTimeout(_toastTimer);
    $t.text(msg).addClass('show');
    _toastTimer = setTimeout(function () {
      $t.removeClass('show');
    }, duration);
  }


  /* ═══════════════════════════════════════════════════════
     TOUCH/SWIPE — volver atrás deslizando a la derecha
     ═══════════════════════════════════════════════════════ */
  let _swipeStartX = 0;

  $(document).on('touchstart', function (e) {
    _swipeStartX = e.originalEvent.changedTouches[0].clientX;
  });

  $(document).on('touchend', function (e) {
    const dx = e.originalEvent.changedTouches[0].clientX - _swipeStartX;
    // Swipe derecha ≥ 70px estando en sub-pantalla → volver a Preferencias
    if (dx >= 70) {
      const $active = $('.screen.active');
      if ($active.is('#screenSonidos') || $active.is('#screenVoz') || $active.is('#screenLaborales')) {
        goTo('screenPreferencias');
      } else if ($active.is('#screenPreferencias') || $active.is('#screenHome')) {
        // No hay atrás desde Home / Preferencias principal
      }
    }
  });


  /* ═══════════════════════════════════════════════════════
     ENTER en formulario de login
     ═══════════════════════════════════════════════════════ */
  $('#inputEmail, #inputPwd').on('keydown', function (e) {
    if (e.key === 'Enter') {
      $('#btnLogin').trigger('click');
    }
  });


  /* ═══════════════════════════════════════════════════════
     INIT
     ═══════════════════════════════════════════════════════ */
  initAllRadioDots();
  initSliders();

}); // END document.ready
