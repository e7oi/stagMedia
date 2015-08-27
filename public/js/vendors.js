/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!

Holder - client side image placeholders
Version 2.8.0+7srgw
© 2015 Ivan Malopinsky - http://imsky.co

Site:     http://holderjs.com
Issues:   https://github.com/imsky/holder/issues
License:  MIT

*/
(function (window) {
  if (!window.document) return;
  var document = window.document;

  //https://github.com/inexorabletash/polyfill/blob/master/web.js
    if (!document.querySelectorAll) {
      document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
          element = document._qsa.shift();
          element.style.removeAttribute('x-qsa');
          elements.push(element);
        }
        document._qsa = null;
        return elements;
      };
    }

    if (!document.querySelector) {
      document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
      };
    }

    if (!document.getElementsByClassName) {
      document.getElementsByClassName = function (classNames) {
        classNames = String(classNames).replace(/^|\s+/g, '.');
        return document.querySelectorAll(classNames);
      };
    }

  //https://github.com/inexorabletash/polyfill
  // ES5 15.2.3.14 Object.keys ( O )
  // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
  if (!Object.keys) {
    Object.keys = function (o) {
      if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
      var ret = [], p;
      for (p in o) {
        if (Object.prototype.hasOwnProperty.call(o, p)) {
          ret.push(p);
        }
      }
      return ret;
    };
  }

  //https://github.com/inexorabletash/polyfill/blob/master/web.js
  (function (global) {
    var B64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    global.atob = global.atob || function (input) {
      input = String(input);
      var position = 0,
          output = [],
          buffer = 0, bits = 0, n;

      input = input.replace(/\s/g, '');
      if ((input.length % 4) === 0) { input = input.replace(/=+$/, ''); }
      if ((input.length % 4) === 1) { throw Error('InvalidCharacterError'); }
      if (/[^+/0-9A-Za-z]/.test(input)) { throw Error('InvalidCharacterError'); }

      while (position < input.length) {
        n = B64_ALPHABET.indexOf(input.charAt(position));
        buffer = (buffer << 6) | n;
        bits += 6;

        if (bits === 24) {
          output.push(String.fromCharCode((buffer >> 16) & 0xFF));
          output.push(String.fromCharCode((buffer >>  8) & 0xFF));
          output.push(String.fromCharCode(buffer & 0xFF));
          bits = 0;
          buffer = 0;
        }
        position += 1;
      }

      if (bits === 12) {
        buffer = buffer >> 4;
        output.push(String.fromCharCode(buffer & 0xFF));
      } else if (bits === 18) {
        buffer = buffer >> 2;
        output.push(String.fromCharCode((buffer >> 8) & 0xFF));
        output.push(String.fromCharCode(buffer & 0xFF));
      }

      return output.join('');
    };

    global.btoa = global.btoa || function (input) {
      input = String(input);
      var position = 0,
          out = [],
          o1, o2, o3,
          e1, e2, e3, e4;

      if (/[^\x00-\xFF]/.test(input)) { throw Error('InvalidCharacterError'); }

      while (position < input.length) {
        o1 = input.charCodeAt(position++);
        o2 = input.charCodeAt(position++);
        o3 = input.charCodeAt(position++);

        // 111111 112222 222233 333333
        e1 = o1 >> 2;
        e2 = ((o1 & 0x3) << 4) | (o2 >> 4);
        e3 = ((o2 & 0xf) << 2) | (o3 >> 6);
        e4 = o3 & 0x3f;

        if (position === input.length + 2) {
          e3 = 64; e4 = 64;
        }
        else if (position === input.length + 1) {
          e4 = 64;
        }

        out.push(B64_ALPHABET.charAt(e1),
                 B64_ALPHABET.charAt(e2),
                 B64_ALPHABET.charAt(e3),
                 B64_ALPHABET.charAt(e4));
      }

      return out.join('');
    };
  }(window));

  //https://gist.github.com/jimeh/332357
  if (!Object.prototype.hasOwnProperty){
      /*jshint -W001, -W103 */
      Object.prototype.hasOwnProperty = function(prop) {
      var proto = this.__proto__ || this.constructor.prototype;
      return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
    };
      /*jshint +W001, +W103 */
  }

  // @license http://opensource.org/licenses/MIT
  // copyright Paul Irish 2015


  // Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
  //   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
  // as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

  // if you want values similar to what you'd get with real perf.now, place this towards the head of the page
  // but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


  (function(){

    if ('performance' in window === false) {
        window.performance = {};
    }
    
    Date.now = (Date.now || function () {  // thanks IE8
      return new Date().getTime();
    });

    if ('now' in window.performance === false){
      
      var nowOffset = Date.now();
      
      if (performance.timing && performance.timing.navigationStart){
        nowOffset = performance.timing.navigationStart;
      }

      window.performance.now = function now(){
        return Date.now() - nowOffset;
      };
    }

  })();

  //requestAnimationFrame polyfill for older Firefox/Chrome versions
  if (!window.requestAnimationFrame) {
    if (window.webkitRequestAnimationFrame) {
    //https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/requestAnimationFrame/polyfill-webkit.js
    (function (global) {
      // window.requestAnimationFrame
      global.requestAnimationFrame = function (callback) {
        return webkitRequestAnimationFrame(function () {
          callback(global.performance.now());
        });
      };

      // window.cancelAnimationFrame
      global.cancelAnimationFrame = webkitCancelAnimationFrame;
    }(window));
    } else if (window.mozRequestAnimationFrame) {
      //https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/requestAnimationFrame/polyfill-moz.js
    (function (global) {
      // window.requestAnimationFrame
      global.requestAnimationFrame = function (callback) {
        return mozRequestAnimationFrame(function () {
          callback(global.performance.now());
        });
      };

      // window.cancelAnimationFrame
      global.cancelAnimationFrame = mozCancelAnimationFrame;
    }(window));
    } else {
    (function (global) {
      global.requestAnimationFrame = function (callback) {
      return global.setTimeout(callback, 1000 / 60);
      };

      global.cancelAnimationFrame = global.clearTimeout;
    })(window);
    }
  }
})(this);

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Holder"] = factory();
	else
		root["Holder"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	Holder.js - client side image placeholders
	(c) 2012-2015 Ivan Malopinsky - http://imsky.co
	*/

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	Holder.js - client side image placeholders
	(c) 2012-2015 Ivan Malopinsky - http://imsky.co
	*/

	//Libraries and functions
	var onDomReady = __webpack_require__(3);
	var querystring = __webpack_require__(2);

	var SceneGraph = __webpack_require__(4);
	var utils = __webpack_require__(5);
	var SVG = __webpack_require__(6);
	var DOM = __webpack_require__(7);
	var Color = __webpack_require__(8);

	var extend = utils.extend;
	var dimensionCheck = utils.dimensionCheck;

	//Constants and definitions
	var SVG_NS = 'http://www.w3.org/2000/svg';
	var NODE_TYPE_COMMENT = 8;
	var version = '2.8.0';
	var generatorComment = '\n' +
	    'Created with Holder.js ' + version + '.\n' +
	    'Learn more at http://holderjs.com\n' +
	    '(c) 2012-2015 Ivan Malopinsky - http://imsky.co\n';

	var Holder = {
	    version: version,

	    /**
	     * Adds a theme to default settings
	     *
	     * @param {string} name Theme name
	     * @param {Object} theme Theme object, with foreground, background, size, font, and fontweight properties.
	     */
	    addTheme: function(name, theme) {
	        name != null && theme != null && (App.settings.themes[name] = theme);
	        delete App.vars.cache.themeKeys;
	        return this;
	    },

	    /**
	     * Appends a placeholder to an element
	     *
	     * @param {string} src Placeholder URL string
	     * @param el A selector or a reference to a DOM node
	     */
	    addImage: function(src, el) {
	        //todo: use jquery fallback if available for all QSA references
	        var node = DOM.getNodeArray(el);
	        if (node.length) {
	            for (var i = 0, l = node.length; i < l; i++) {
	                var img = DOM.newEl('img');
	                var domProps = {};
	                domProps[App.setup.dataAttr] = src;
	                DOM.setAttr(img, domProps);
	                node[i].appendChild(img);
	            }
	        }
	        return this;
	    },

	    /**
	     * Sets whether or not an image is updated on resize.
	     * If an image is set to be updated, it is immediately rendered.
	     *
	     * @param {Object} el Image DOM element
	     * @param {Boolean} value Resizable update flag value
	     */
	    setResizeUpdate: function(el, value) {
	        if (el.holderData) {
	            el.holderData.resizeUpdate = !!value;
	            if (el.holderData.resizeUpdate) {
	                updateResizableElements(el);
	            }
	        }
	    },

	    /**
	     * Runs Holder with options. By default runs Holder on all images with "holder.js" in their source attributes.
	     *
	     * @param {Object} userOptions Options object, can contain domain, themes, images, and bgnodes properties
	     */
	    run: function(userOptions) {
	        //todo: split processing into separate queues
	        userOptions = userOptions || {};
	        var engineSettings = {};
	        var options = extend(App.settings, userOptions);

	        App.vars.preempted = true;
	        App.vars.dataAttr = options.dataAttr || App.setup.dataAttr;
	        App.vars.lineWrapRatio = options.lineWrapRatio || App.setup.lineWrapRatio;

	        engineSettings.renderer = options.renderer ? options.renderer : App.setup.renderer;
	        if (App.setup.renderers.join(',').indexOf(engineSettings.renderer) === -1) {
	            engineSettings.renderer = App.setup.supportsSVG ? 'svg' : (App.setup.supportsCanvas ? 'canvas' : 'html');
	        }

	        var images = DOM.getNodeArray(options.images);
	        var bgnodes = DOM.getNodeArray(options.bgnodes);
	        var stylenodes = DOM.getNodeArray(options.stylenodes);
	        var objects = DOM.getNodeArray(options.objects);

	        engineSettings.stylesheets = [];
	        engineSettings.svgXMLStylesheet = true;
	        engineSettings.noFontFallback = options.noFontFallback ? options.noFontFallback : false;

	        for (var i = 0; i < stylenodes.length; i++) {
	            var styleNode = stylenodes[i];
	            if (styleNode.attributes.rel && styleNode.attributes.href && styleNode.attributes.rel.value == 'stylesheet') {
	                var href = styleNode.attributes.href.value;
	                //todo: write isomorphic relative-to-absolute URL function
	                var proxyLink = DOM.newEl('a');
	                proxyLink.href = href;
	                var stylesheetURL = proxyLink.protocol + '//' + proxyLink.host + proxyLink.pathname + proxyLink.search;
	                engineSettings.stylesheets.push(stylesheetURL);
	            }
	        }

	        for (i = 0; i < bgnodes.length; i++) {
	            //Skip processing background nodes if getComputedStyle is unavailable, since only modern browsers would be able to use canvas or SVG to render to background
	            if (!global.getComputedStyle) continue;
	            var backgroundImage = global.getComputedStyle(bgnodes[i], null).getPropertyValue('background-image');
	            var dataBackgroundImage = bgnodes[i].getAttribute('data-background-src');
	            var rawURL = dataBackgroundImage || backgroundImage;

	            var holderURL = null;
	            var holderString = '?' + options.domain + '/';

	            if (rawURL.indexOf(holderString) === 0) {
	                holderURL = rawURL.slice(1);
	            } else if (rawURL.indexOf(holderString) != -1) {
	                var fragment = rawURL.substr(rawURL.indexOf(holderString)).slice(1);
	                var fragmentMatch = fragment.match(/([^\"]*)"?\)/);

	                if (fragmentMatch != null) {
	                    holderURL = fragmentMatch[1];
	                }
	            }

	            if (holderURL != null) {
	                var holderFlags = parseURL(holderURL, options);
	                if (holderFlags) {
	                    prepareDOMElement({
	                        mode: 'background',
	                        el: bgnodes[i],
	                        flags: holderFlags,
	                        engineSettings: engineSettings
	                    });
	                }
	            }
	        }

	        for (i = 0; i < objects.length; i++) {
	            var object = objects[i];
	            var objectAttr = {};

	            try {
	                objectAttr.data = object.getAttribute('data');
	                objectAttr.dataSrc = object.getAttribute(App.vars.dataAttr);
	            } catch (e) {}

	            var objectHasSrcURL = objectAttr.data != null && objectAttr.data.indexOf(options.domain) === 0;
	            var objectHasDataSrcURL = objectAttr.dataSrc != null && objectAttr.dataSrc.indexOf(options.domain) === 0;

	            if (objectHasSrcURL) {
	                prepareImageElement(options, engineSettings, objectAttr.data, object);
	            } else if (objectHasDataSrcURL) {
	                prepareImageElement(options, engineSettings, objectAttr.dataSrc, object);
	            }
	        }

	        for (i = 0; i < images.length; i++) {
	            var image = images[i];
	            var imageAttr = {};

	            try {
	                imageAttr.src = image.getAttribute('src');
	                imageAttr.dataSrc = image.getAttribute(App.vars.dataAttr);
	                imageAttr.rendered = image.getAttribute('data-holder-rendered');
	            } catch (e) {}

	            var imageHasSrc = imageAttr.src != null;
	            var imageHasDataSrcURL = imageAttr.dataSrc != null && imageAttr.dataSrc.indexOf(options.domain) === 0;
	            var imageRendered = imageAttr.rendered != null && imageAttr.rendered == 'true';

	            if (imageHasSrc) {
	                if (imageAttr.src.indexOf(options.domain) === 0) {
	                    prepareImageElement(options, engineSettings, imageAttr.src, image);
	                } else if (imageHasDataSrcURL) {
	                    //Image has a valid data-src and an invalid src
	                    if (imageRendered) {
	                        //If the placeholder has already been render, re-render it
	                        prepareImageElement(options, engineSettings, imageAttr.dataSrc, image);
	                    } else {
	                        //If the placeholder has not been rendered, check if the image exists and render a fallback if it doesn't
	                        (function(src, options, engineSettings, dataSrc, image) {
	                            utils.imageExists(src, function(exists) {
	                                if (!exists) {
	                                    prepareImageElement(options, engineSettings, dataSrc, image);
	                                }
	                            });
	                        })(imageAttr.src, options, engineSettings, imageAttr.dataSrc, image);
	                    }
	                }
	            } else if (imageHasDataSrcURL) {
	                prepareImageElement(options, engineSettings, imageAttr.dataSrc, image);
	            }
	        }

	        return this;
	    }
	};

	var App = {
	    settings: {
	        domain: 'holder.js',
	        images: 'img',
	        objects: 'object',
	        bgnodes: 'body .holderjs',
	        stylenodes: 'head link.holderjs',
	        themes: {
	            'gray': {
	                background: '#EEEEEE',
	                foreground: '#AAAAAA'
	            },
	            'social': {
	                background: '#3a5a97',
	                foreground: '#FFFFFF'
	            },
	            'industrial': {
	                background: '#434A52',
	                foreground: '#C2F200'
	            },
	            'sky': {
	                background: '#0D8FDB',
	                foreground: '#FFFFFF'
	            },
	            'vine': {
	                background: '#39DBAC',
	                foreground: '#1E292C'
	            },
	            'lava': {
	                background: '#F8591A',
	                foreground: '#1C2846'
	            }
	        }
	    },
	    defaults: {
	        size: 10,
	        units: 'pt',
	        scale: 1 / 16
	    }
	};

	/**
	 * Processes provided source attribute and sets up the appropriate rendering workflow
	 *
	 * @private
	 * @param options Instance options from Holder.run
	 * @param renderSettings Instance configuration
	 * @param src Image URL
	 * @param el Image DOM element
	 */
	function prepareImageElement(options, engineSettings, src, el) {
	    var holderFlags = parseURL(src.substr(src.lastIndexOf(options.domain)), options);
	    if (holderFlags) {
	        prepareDOMElement({
	            mode: null,
	            el: el,
	            flags: holderFlags,
	            engineSettings: engineSettings
	        });
	    }
	}

	/**
	 * Processes a Holder URL
	 *
	 * @private
	 * @param url URL
	 * @param options Instance options from Holder.run
	 */
	function parseURL(url, options) {
	    var holder = {
	        theme: extend(App.settings.themes.gray, null),
	        stylesheets: options.stylesheets,
	        instanceOptions: options
	    };

	    return parseQueryString(url, holder);
	}

	/**
	 * Processes a Holder URL and extracts configuration from query string
	 *
	 * @private
	 * @param url URL
	 * @param holder Staging Holder object
	 */
	function parseQueryString(url, holder) {
	    var parts = url.split('?');
	    var basics = parts[0].split('/');

	    holder.holderURL = url;

	    var dimensions = basics[1];
	    var dimensionData = dimensions.match(/([\d]+p?)x([\d]+p?)/);

	    if (!dimensionData) return false;

	    holder.fluid = dimensions.indexOf('p') !== -1;

	    holder.dimensions = {
	        width: dimensionData[1].replace('p', '%'),
	        height: dimensionData[2].replace('p', '%')
	    };

	    if (parts.length === 2) {
	        var options = querystring.parse(parts[1]);

	        // Colors

	        if (options.bg) {
	            holder.theme.background = (options.bg.indexOf('#') === -1 ? '#' : '') + options.bg;
	        }

	        if (options.fg) {
	            holder.theme.foreground = (options.fg.indexOf('#') === -1 ? '#' : '') + options.fg;
	        }

	        //todo: add automatic foreground to themes without foreground
	        if (options.bg && !options.fg) {
	            holder.autoFg = true;
	        }

	        if (options.theme && holder.instanceOptions.themes.hasOwnProperty(options.theme)) {
	            holder.theme = extend(holder.instanceOptions.themes[options.theme], null);
	        }

	        // Text

	        if (options.text) {
	            holder.text = options.text;
	        }

	        if (options.textmode) {
	            holder.textmode = options.textmode;
	        }

	        if (options.size) {
	            holder.size = options.size;
	        }

	        if (options.font) {
	            holder.font = options.font;
	        }

	        if (options.align) {
	            holder.align = options.align;
	        }

	        holder.nowrap = utils.truthy(options.nowrap);

	        // Miscellaneous

	        holder.auto = utils.truthy(options.auto);

	        holder.outline = utils.truthy(options.outline);

	        if (utils.truthy(options.random)) {
	            App.vars.cache.themeKeys = App.vars.cache.themeKeys || Object.keys(holder.instanceOptions.themes);
	            var _theme = App.vars.cache.themeKeys[0 | Math.random() * App.vars.cache.themeKeys.length];
	            holder.theme = extend(holder.instanceOptions.themes[_theme], null);
	        }
	    }

	    return holder;
	}

	/**
	 * Modifies the DOM to fit placeholders and sets up resizable image callbacks (for fluid and automatically sized placeholders)
	 *
	 * @private
	 * @param settings DOM prep settings
	 */
	function prepareDOMElement(prepSettings) {
	    var mode = prepSettings.mode;
	    var el = prepSettings.el;
	    var flags = prepSettings.flags;
	    var _engineSettings = prepSettings.engineSettings;
	    var dimensions = flags.dimensions,
	        theme = flags.theme;
	    var dimensionsCaption = dimensions.width + 'x' + dimensions.height;
	    mode = mode == null ? (flags.fluid ? 'fluid' : 'image') : mode;

	    if (flags.text != null) {
	        theme.text = flags.text;

	        //<object> SVG embedding doesn't parse Unicode properly
	        if (el.nodeName.toLowerCase() === 'object') {
	            var textLines = theme.text.split('\\n');
	            for (var k = 0; k < textLines.length; k++) {
	                textLines[k] = utils.encodeHtmlEntity(textLines[k]);
	            }
	            theme.text = textLines.join('\\n');
	        }
	    }

	    var holderURL = flags.holderURL;
	    var engineSettings = extend(_engineSettings, null);

	    if (flags.font) {
	        theme.font = flags.font;
	        //Only run the <canvas> webfont fallback if noFontFallback is false, if the node is not an image, and if canvas is supported
	        if (!engineSettings.noFontFallback && el.nodeName.toLowerCase() === 'img' && App.setup.supportsCanvas && engineSettings.renderer === 'svg') {
	            engineSettings = extend(engineSettings, {
	                renderer: 'canvas'
	            });
	        }
	    }

	    //Chrome and Opera require a quick 10ms re-render if web fonts are used with canvas
	    if (flags.font && engineSettings.renderer == 'canvas') {
	        engineSettings.reRender = true;
	    }

	    if (mode == 'background') {
	        if (el.getAttribute('data-background-src') == null) {
	            DOM.setAttr(el, {
	                'data-background-src': holderURL
	            });
	        }
	    } else {
	        var domProps = {};
	        domProps[App.vars.dataAttr] = holderURL;
	        DOM.setAttr(el, domProps);
	    }

	    flags.theme = theme;

	    //todo consider using all renderSettings in holderData
	    el.holderData = {
	        flags: flags,
	        engineSettings: engineSettings
	    };

	    if (mode == 'image' || mode == 'fluid') {
	        DOM.setAttr(el, {
	            'alt': (theme.text ? theme.text + ' [' + dimensionsCaption + ']' : dimensionsCaption)
	        });
	    }

	    var renderSettings = {
	        mode: mode,
	        el: el,
	        holderSettings: {
	            dimensions: dimensions,
	            theme: theme,
	            flags: flags
	        },
	        engineSettings: engineSettings
	    };

	    if (mode == 'image') {
	        if (engineSettings.renderer == 'html' || !flags.auto) {
	            el.style.width = dimensions.width + 'px';
	            el.style.height = dimensions.height + 'px';
	        }
	        if (engineSettings.renderer == 'html') {
	            el.style.backgroundColor = theme.background;
	        } else {
	            render(renderSettings);

	            if (flags.textmode == 'exact') {
	                el.holderData.resizeUpdate = true;
	                App.vars.resizableImages.push(el);
	                updateResizableElements(el);
	            }
	        }
	    } else if (mode == 'background' && engineSettings.renderer != 'html') {
	        render(renderSettings);
	    } else if (mode == 'fluid') {
	        el.holderData.resizeUpdate = true;

	        if (dimensions.height.slice(-1) == '%') {
	            el.style.height = dimensions.height;
	        } else if (flags.auto == null || !flags.auto) {
	            el.style.height = dimensions.height + 'px';
	        }
	        if (dimensions.width.slice(-1) == '%') {
	            el.style.width = dimensions.width;
	        } else if (flags.auto == null || !flags.auto) {
	            el.style.width = dimensions.width + 'px';
	        }
	        if (el.style.display == 'inline' || el.style.display === '' || el.style.display == 'none') {
	            el.style.display = 'block';
	        }

	        setInitialDimensions(el);

	        if (engineSettings.renderer == 'html') {
	            el.style.backgroundColor = theme.background;
	        } else {
	            App.vars.resizableImages.push(el);
	            updateResizableElements(el);
	        }
	    }
	}

	/**
	 * Core function that takes output from renderers and sets it as the source or background-image of the target element
	 *
	 * @private
	 * @param renderSettings Renderer settings
	 */
	function render(renderSettings) {
	    var image = null;
	    var mode = renderSettings.mode;
	    var el = renderSettings.el;
	    var holderSettings = renderSettings.holderSettings;
	    var engineSettings = renderSettings.engineSettings;

	    switch (engineSettings.renderer) {
	        case 'svg':
	            if (!App.setup.supportsSVG) return;
	            break;
	        case 'canvas':
	            if (!App.setup.supportsCanvas) return;
	            break;
	        default:
	            return;
	    }

	    //todo: move generation of scene up to flag generation to reduce extra object creation
	    var scene = {
	        width: holderSettings.dimensions.width,
	        height: holderSettings.dimensions.height,
	        theme: holderSettings.theme,
	        flags: holderSettings.flags
	    };

	    var sceneGraph = buildSceneGraph(scene);

	    function getRenderedImage() {
	        var image = null;
	        switch (engineSettings.renderer) {
	            case 'canvas':
	                image = sgCanvasRenderer(sceneGraph, renderSettings);
	                break;
	            case 'svg':
	                image = sgSVGRenderer(sceneGraph, renderSettings);
	                break;
	            default:
	                throw 'Holder: invalid renderer: ' + engineSettings.renderer;
	        }

	        return image;
	    }

	    image = getRenderedImage();

	    if (image == null) {
	        throw 'Holder: couldn\'t render placeholder';
	    }

	    //todo: add <object> canvas rendering
	    if (mode == 'background') {
	        el.style.backgroundImage = 'url(' + image + ')';
	        el.style.backgroundSize = scene.width + 'px ' + scene.height + 'px';
	    } else {
	        if (el.nodeName.toLowerCase() === 'img') {
	            DOM.setAttr(el, {
	                'src': image
	            });
	        } else if (el.nodeName.toLowerCase() === 'object') {
	            DOM.setAttr(el, {
	                'data': image
	            });
	            DOM.setAttr(el, {
	                'type': 'image/svg+xml'
	            });
	        }
	        if (engineSettings.reRender) {
	            global.setTimeout(function() {
	                var image = getRenderedImage();
	                if (image == null) {
	                    throw 'Holder: couldn\'t render placeholder';
	                }
	                //todo: refactor this code into a function
	                if (el.nodeName.toLowerCase() === 'img') {
	                    DOM.setAttr(el, {
	                        'src': image
	                    });
	                } else if (el.nodeName.toLowerCase() === 'object') {
	                    DOM.setAttr(el, {
	                        'data': image
	                    });
	                    DOM.setAttr(el, {
	                        'type': 'image/svg+xml'
	                    });
	                }
	            }, 150);
	        }
	    }
	    //todo: account for re-rendering
	    DOM.setAttr(el, {
	        'data-holder-rendered': true
	    });
	}

	/**
	 * Core function that takes a Holder scene description and builds a scene graph
	 *
	 * @private
	 * @param scene Holder scene object
	 */
	//todo: make this function reusable
	//todo: merge app defaults and setup properties into the scene argument
	function buildSceneGraph(scene) {
	    var fontSize = App.defaults.size;
	    if (parseFloat(scene.theme.size)) {
	        fontSize = scene.theme.size;
	    } else if (parseFloat(scene.flags.size)) {
	        fontSize = scene.flags.size;
	    }

	    scene.font = {
	        family: scene.theme.font ? scene.theme.font : 'Arial, Helvetica, Open Sans, sans-serif',
	        size: textSize(scene.width, scene.height, fontSize),
	        units: scene.theme.units ? scene.theme.units : App.defaults.units,
	        weight: scene.theme.fontweight ? scene.theme.fontweight : 'bold'
	    };

	    scene.text = scene.theme.text || Math.floor(scene.width) + 'x' + Math.floor(scene.height);

	    scene.noWrap = scene.theme.nowrap || scene.flags.nowrap;

	    scene.align = scene.theme.align || scene.flags.align || 'center';

	    switch (scene.flags.textmode) {
	        case 'literal':
	            scene.text = scene.flags.dimensions.width + 'x' + scene.flags.dimensions.height;
	            break;
	        case 'exact':
	            if (!scene.flags.exactDimensions) break;
	            scene.text = Math.floor(scene.flags.exactDimensions.width) + 'x' + Math.floor(scene.flags.exactDimensions.height);
	            break;
	    }

	    var sceneGraph = new SceneGraph({
	        width: scene.width,
	        height: scene.height
	    });

	    var Shape = sceneGraph.Shape;

	    var holderBg = new Shape.Rect('holderBg', {
	        fill: scene.theme.background
	    });

	    holderBg.resize(scene.width, scene.height);
	    sceneGraph.root.add(holderBg);

	    if (scene.flags.outline) {
	        //todo: generalize darken/lighten to more than RRGGBB hex values
	        var outlineColor = new Color(holderBg.properties.fill);

	        outlineColor = outlineColor.lighten(outlineColor.lighterThan('7f7f7f') ? -0.1 : 0.1);

	        holderBg.properties.outline = {
	            fill: outlineColor.toHex(true),
	            width: 2
	        };
	    }

	    var holderTextColor = scene.theme.foreground;

	    if (scene.flags.autoFg) {
	        var holderBgColor = new Color(holderBg.properties.fill);
	        var lightColor = new Color('fff');
	        var darkColor = new Color('000', { 'alpha': 0.285714 });

	        holderTextColor = holderBgColor.blendAlpha(holderBgColor.lighterThan('7f7f7f') ? darkColor : lightColor).toHex(true);
	    }

	    var holderTextGroup = new Shape.Group('holderTextGroup', {
	        text: scene.text,
	        align: scene.align,
	        font: scene.font,
	        fill: holderTextColor
	    });

	    holderTextGroup.moveTo(null, null, 1);
	    sceneGraph.root.add(holderTextGroup);

	    var tpdata = holderTextGroup.textPositionData = stagingRenderer(sceneGraph);
	    if (!tpdata) {
	        throw 'Holder: staging fallback not supported yet.';
	    }
	    holderTextGroup.properties.leading = tpdata.boundingBox.height;

	    var textNode = null;
	    var line = null;

	    function finalizeLine(parent, line, width, height) {
	        line.width = width;
	        line.height = height;
	        parent.width = Math.max(parent.width, line.width);
	        parent.height += line.height;
	    }

	    var sceneMargin = scene.width * App.vars.lineWrapRatio;
	    var maxLineWidth = sceneMargin;

	    if (tpdata.lineCount > 1) {
	        var offsetX = 0;
	        var offsetY = 0;
	        var lineIndex = 0;
	        var lineKey;
	        line = new Shape.Group('line' + lineIndex);

	        //Double margin so that left/right-aligned next is not flush with edge of image
	        if (scene.align === 'left' || scene.align === 'right') {
	            maxLineWidth = scene.width * (1 - (1 - (App.vars.lineWrapRatio)) * 2);
	        }

	        for (var i = 0; i < tpdata.words.length; i++) {
	            var word = tpdata.words[i];
	            textNode = new Shape.Text(word.text);
	            var newline = word.text == '\\n';
	            if (!scene.noWrap && (offsetX + word.width >= maxLineWidth || newline === true)) {
	                finalizeLine(holderTextGroup, line, offsetX, holderTextGroup.properties.leading);
	                holderTextGroup.add(line);
	                offsetX = 0;
	                offsetY += holderTextGroup.properties.leading;
	                lineIndex += 1;
	                line = new Shape.Group('line' + lineIndex);
	                line.y = offsetY;
	            }
	            if (newline === true) {
	                continue;
	            }
	            textNode.moveTo(offsetX, 0);
	            offsetX += tpdata.spaceWidth + word.width;
	            line.add(textNode);
	        }

	        finalizeLine(holderTextGroup, line, offsetX, holderTextGroup.properties.leading);
	        holderTextGroup.add(line);

	        if (scene.align === 'left') {
	            holderTextGroup.moveTo(scene.width - sceneMargin, null, null);
	        } else if (scene.align === 'right') {
	            for (lineKey in holderTextGroup.children) {
	                line = holderTextGroup.children[lineKey];
	                line.moveTo(scene.width - line.width, null, null);
	            }

	            holderTextGroup.moveTo(0 - (scene.width - sceneMargin), null, null);
	        } else {
	            for (lineKey in holderTextGroup.children) {
	                line = holderTextGroup.children[lineKey];
	                line.moveTo((holderTextGroup.width - line.width) / 2, null, null);
	            }

	            holderTextGroup.moveTo((scene.width - holderTextGroup.width) / 2, null, null);
	        }

	        holderTextGroup.moveTo(null, (scene.height - holderTextGroup.height) / 2, null);

	        //If the text exceeds vertical space, move it down so the first line is visible
	        if ((scene.height - holderTextGroup.height) / 2 < 0) {
	            holderTextGroup.moveTo(null, 0, null);
	        }
	    } else {
	        textNode = new Shape.Text(scene.text);
	        line = new Shape.Group('line0');
	        line.add(textNode);
	        holderTextGroup.add(line);

	        if (scene.align === 'left') {
	            holderTextGroup.moveTo(scene.width - sceneMargin, null, null);
	        } else if (scene.align === 'right') {
	            holderTextGroup.moveTo(0 - (scene.width - sceneMargin), null, null);
	        } else {
	            holderTextGroup.moveTo((scene.width - tpdata.boundingBox.width) / 2, null, null);
	        }

	        holderTextGroup.moveTo(null, (scene.height - tpdata.boundingBox.height) / 2, null);
	    }

	    //todo: renderlist
	    return sceneGraph;
	}

	/**
	 * Adaptive text sizing function
	 *
	 * @private
	 * @param width Parent width
	 * @param height Parent height
	 * @param fontSize Requested text size
	 */
	function textSize(width, height, fontSize) {
	    var stageWidth = parseInt(width, 10);
	    var stageHeight = parseInt(height, 10);

	    var bigSide = Math.max(stageWidth, stageHeight);
	    var smallSide = Math.min(stageWidth, stageHeight);

	    var newHeight = 0.8 * Math.min(smallSide, bigSide * App.defaults.scale);
	    return Math.round(Math.max(fontSize, newHeight));
	}

	/**
	 * Iterates over resizable (fluid or auto) placeholders and renders them
	 *
	 * @private
	 * @param element Optional element selector, specified only if a specific element needs to be re-rendered
	 */
	function updateResizableElements(element) {
	    var images;
	    if (element == null || element.nodeType == null) {
	        images = App.vars.resizableImages;
	    } else {
	        images = [element];
	    }
	    for (var i = 0, l = images.length; i < l; i++) {
	        var el = images[i];
	        if (el.holderData) {
	            var flags = el.holderData.flags;
	            var dimensions = dimensionCheck(el);
	            if (dimensions) {
	                if (!el.holderData.resizeUpdate) {
	                    continue;
	                }

	                if (flags.fluid && flags.auto) {
	                    var fluidConfig = el.holderData.fluidConfig;
	                    switch (fluidConfig.mode) {
	                        case 'width':
	                            dimensions.height = dimensions.width / fluidConfig.ratio;
	                            break;
	                        case 'height':
	                            dimensions.width = dimensions.height * fluidConfig.ratio;
	                            break;
	                    }
	                }

	                var settings = {
	                    mode: 'image',
	                    holderSettings: {
	                        dimensions: dimensions,
	                        theme: flags.theme,
	                        flags: flags
	                    },
	                    el: el,
	                    engineSettings: el.holderData.engineSettings
	                };

	                if (flags.textmode == 'exact') {
	                    flags.exactDimensions = dimensions;
	                    settings.holderSettings.dimensions = flags.dimensions;
	                }

	                render(settings);
	            } else {
	                setInvisible(el);
	            }
	        }
	    }
	}

	/**
	 * Sets up aspect ratio metadata for fluid placeholders, in order to preserve proportions when resizing
	 *
	 * @private
	 * @param el Image DOM element
	 */
	function setInitialDimensions(el) {
	    if (el.holderData) {
	        var dimensions = dimensionCheck(el);
	        if (dimensions) {
	            var flags = el.holderData.flags;

	            var fluidConfig = {
	                fluidHeight: flags.dimensions.height.slice(-1) == '%',
	                fluidWidth: flags.dimensions.width.slice(-1) == '%',
	                mode: null,
	                initialDimensions: dimensions
	            };

	            if (fluidConfig.fluidWidth && !fluidConfig.fluidHeight) {
	                fluidConfig.mode = 'width';
	                fluidConfig.ratio = fluidConfig.initialDimensions.width / parseFloat(flags.dimensions.height);
	            } else if (!fluidConfig.fluidWidth && fluidConfig.fluidHeight) {
	                fluidConfig.mode = 'height';
	                fluidConfig.ratio = parseFloat(flags.dimensions.width) / fluidConfig.initialDimensions.height;
	            }

	            el.holderData.fluidConfig = fluidConfig;
	        } else {
	            setInvisible(el);
	        }
	    }
	}

	/**
	 * Iterates through all current invisible images, and if they're visible, renders them and removes them from further checks. Runs every animation frame.
	 *
	 * @private
	 */
	function visibilityCheck() {
	    var renderableImages = [];
	    var keys = Object.keys(App.vars.invisibleImages);
	    var el;
	    for (var i = 0, l = keys.length; i < l; i++) {
	        el = App.vars.invisibleImages[keys[i]];
	        if (dimensionCheck(el) && el.nodeName.toLowerCase() == 'img') {
	            renderableImages.push(el);
	            delete App.vars.invisibleImages[keys[i]];
	        }
	    }

	    if (renderableImages.length) {
	        Holder.run({
	            images: renderableImages
	        });
	    }

	    global.requestAnimationFrame(visibilityCheck);
	}

	/**
	 * Starts checking for invisible placeholders if not doing so yet. Does nothing otherwise.
	 *
	 * @private
	 */
	function startVisibilityCheck() {
	    if (!App.vars.visibilityCheckStarted) {
	        global.requestAnimationFrame(visibilityCheck);
	        App.vars.visibilityCheckStarted = true;
	    }
	}

	/**
	 * Sets a unique ID for an image detected to be invisible and adds it to the map of invisible images checked by visibilityCheck
	 *
	 * @private
	 * @param el Invisible DOM element
	 */
	function setInvisible(el) {
	    if (!el.holderData.invisibleId) {
	        App.vars.invisibleId += 1;
	        App.vars.invisibleImages['i' + App.vars.invisibleId] = el;
	        el.holderData.invisibleId = App.vars.invisibleId;
	    }
	}

	//todo: see if possible to convert stagingRenderer to use HTML only
	var stagingRenderer = (function() {
	    var svg = null,
	        stagingText = null,
	        stagingTextNode = null;
	    return function(graph) {
	        var rootNode = graph.root;
	        if (App.setup.supportsSVG) {
	            var firstTimeSetup = false;
	            var tnode = function(text) {
	                return document.createTextNode(text);
	            };
	            if (svg == null || svg.parentNode !== document.body) {
	                firstTimeSetup = true;
	            }

	            svg = SVG.initSVG(svg, rootNode.properties.width, rootNode.properties.height);
	            //Show staging element before staging
	            svg.style.display = 'block';

	            if (firstTimeSetup) {
	                stagingText = DOM.newEl('text', SVG_NS);
	                stagingTextNode = tnode(null);
	                DOM.setAttr(stagingText, {
	                    x: 0
	                });
	                stagingText.appendChild(stagingTextNode);
	                svg.appendChild(stagingText);
	                document.body.appendChild(svg);
	                svg.style.visibility = 'hidden';
	                svg.style.position = 'absolute';
	                svg.style.top = '-100%';
	                svg.style.left = '-100%';
	                //todo: workaround for zero-dimension <svg> tag in Opera 12
	                //svg.setAttribute('width', 0);
	                //svg.setAttribute('height', 0);
	            }

	            var holderTextGroup = rootNode.children.holderTextGroup;
	            var htgProps = holderTextGroup.properties;
	            DOM.setAttr(stagingText, {
	                'y': htgProps.font.size,
	                'style': utils.cssProps({
	                    'font-weight': htgProps.font.weight,
	                    'font-size': htgProps.font.size + htgProps.font.units,
	                    'font-family': htgProps.font.family
	                })
	            });

	            //Get bounding box for the whole string (total width and height)
	            stagingTextNode.nodeValue = htgProps.text;
	            var stagingTextBBox = stagingText.getBBox();

	            //Get line count and split the string into words
	            var lineCount = Math.ceil(stagingTextBBox.width / (rootNode.properties.width * App.vars.lineWrapRatio));
	            var words = htgProps.text.split(' ');
	            var newlines = htgProps.text.match(/\\n/g);
	            lineCount += newlines == null ? 0 : newlines.length;

	            //Get bounding box for the string with spaces removed
	            stagingTextNode.nodeValue = htgProps.text.replace(/[ ]+/g, '');
	            var computedNoSpaceLength = stagingText.getComputedTextLength();

	            //Compute average space width
	            var diffLength = stagingTextBBox.width - computedNoSpaceLength;
	            var spaceWidth = Math.round(diffLength / Math.max(1, words.length - 1));

	            //Get widths for every word with space only if there is more than one line
	            var wordWidths = [];
	            if (lineCount > 1) {
	                stagingTextNode.nodeValue = '';
	                for (var i = 0; i < words.length; i++) {
	                    if (words[i].length === 0) continue;
	                    stagingTextNode.nodeValue = utils.decodeHtmlEntity(words[i]);
	                    var bbox = stagingText.getBBox();
	                    wordWidths.push({
	                        text: words[i],
	                        width: bbox.width
	                    });
	                }
	            }

	            //Hide staging element after staging
	            svg.style.display = 'none';

	            return {
	                spaceWidth: spaceWidth,
	                lineCount: lineCount,
	                boundingBox: stagingTextBBox,
	                words: wordWidths
	            };
	        } else {
	            //todo: canvas fallback for measuring text on android 2.3
	            return false;
	        }
	    };
	})();

	var sgCanvasRenderer = (function() {
	    var canvas = DOM.newEl('canvas');
	    var ctx = null;

	    return function(sceneGraph) {
	        if (ctx == null) {
	            ctx = canvas.getContext('2d');
	        }
	        var root = sceneGraph.root;
	        canvas.width = App.dpr(root.properties.width);
	        canvas.height = App.dpr(root.properties.height);
	        ctx.textBaseline = 'middle';

	        var bg = root.children.holderBg;
	        var bgWidth = App.dpr(bg.width);
	        var bgHeight = App.dpr(bg.height);
	        //todo: parametrize outline width (e.g. in scene object)
	        var outlineWidth = 2;
	        var outlineOffsetWidth = outlineWidth / 2;

	        ctx.fillStyle = bg.properties.fill;
	        ctx.fillRect(0, 0, bgWidth, bgHeight);

	        if (bg.properties.outline) {
	            //todo: abstract this into a method
	            ctx.strokeStyle = bg.properties.outline.fill;
	            ctx.lineWidth = bg.properties.outline.width;
	            ctx.moveTo(outlineOffsetWidth, outlineOffsetWidth);
	            // TL, TR, BR, BL
	            ctx.lineTo(bgWidth - outlineOffsetWidth, outlineOffsetWidth);
	            ctx.lineTo(bgWidth - outlineOffsetWidth, bgHeight - outlineOffsetWidth);
	            ctx.lineTo(outlineOffsetWidth, bgHeight - outlineOffsetWidth);
	            ctx.lineTo(outlineOffsetWidth, outlineOffsetWidth);
	            // Diagonals
	            ctx.moveTo(0, outlineOffsetWidth);
	            ctx.lineTo(bgWidth, bgHeight - outlineOffsetWidth);
	            ctx.moveTo(0, bgHeight - outlineOffsetWidth);
	            ctx.lineTo(bgWidth, outlineOffsetWidth);
	            ctx.stroke();
	        }

	        var textGroup = root.children.holderTextGroup;
	        var tgProps = textGroup.properties;
	        ctx.font = textGroup.properties.font.weight + ' ' + App.dpr(textGroup.properties.font.size) + textGroup.properties.font.units + ' ' + textGroup.properties.font.family + ', monospace';
	        ctx.fillStyle = textGroup.properties.fill;

	        for (var lineKey in textGroup.children) {
	            var line = textGroup.children[lineKey];
	            for (var wordKey in line.children) {
	                var word = line.children[wordKey];
	                var x = App.dpr(textGroup.x + line.x + word.x);
	                var y = App.dpr(textGroup.y + line.y + word.y + (textGroup.properties.leading / 2));

	                ctx.fillText(word.properties.text, x, y);
	            }
	        }

	        return canvas.toDataURL('image/png');
	    };
	})();

	var sgSVGRenderer = (function() {
	    //Prevent IE <9 from initializing SVG renderer
	    if (!global.XMLSerializer) return;
	    var xml = DOM.createXML();
	    var svg = SVG.initSVG(null, 0, 0);
	    var bgEl = DOM.newEl('rect', SVG_NS);
	    svg.appendChild(bgEl);

	    //todo: create a reusable pool for textNodes, resize if more words present

	    return function(sceneGraph, renderSettings) {
	        var root = sceneGraph.root;

	        SVG.initSVG(svg, root.properties.width, root.properties.height);

	        var groups = svg.querySelectorAll('g');

	        for (var i = 0; i < groups.length; i++) {
	            groups[i].parentNode.removeChild(groups[i]);
	        }

	        var holderURL = renderSettings.holderSettings.flags.holderURL;
	        var holderId = 'holder_' + (Number(new Date()) + 32768 + (0 | Math.random() * 32768)).toString(16);
	        var sceneGroupEl = DOM.newEl('g', SVG_NS);
	        var textGroup = root.children.holderTextGroup;
	        var tgProps = textGroup.properties;
	        var textGroupEl = DOM.newEl('g', SVG_NS);
	        var tpdata = textGroup.textPositionData;
	        var textCSSRule = '#' + holderId + ' text { ' +
	            utils.cssProps({
	                'fill': tgProps.fill,
	                'font-weight': tgProps.font.weight,
	                'font-family': tgProps.font.family + ', monospace',
	                'font-size': tgProps.font.size + tgProps.font.units
	            }) + ' } ';
	        var commentNode = xml.createComment('\n' + 'Source URL: ' + holderURL + generatorComment);
	        var holderCSS = xml.createCDATASection(textCSSRule);
	        var styleEl = svg.querySelector('style');
	        var bg = root.children.holderBg;

	        DOM.setAttr(sceneGroupEl, {
	            id: holderId
	        });

	        svg.insertBefore(commentNode, svg.firstChild);
	        styleEl.appendChild(holderCSS);

	        sceneGroupEl.appendChild(bgEl);

	        //todo: abstract this into a cross-browser SVG outline method
	        if (bg.properties.outline) {
	            var outlineEl = DOM.newEl('path', SVG_NS);
	            var outlineWidth = bg.properties.outline.width;
	            var outlineOffsetWidth = outlineWidth / 2;
	            DOM.setAttr(outlineEl, {
	                'd': [
	                    'M', outlineOffsetWidth, outlineOffsetWidth,
	                    'H', bg.width - outlineOffsetWidth,
	                    'V', bg.height - outlineOffsetWidth,
	                    'H', outlineOffsetWidth,
	                    'V', 0,
	                    'M', 0, outlineOffsetWidth,
	                    'L', bg.width, bg.height - outlineOffsetWidth,
	                    'M', 0, bg.height - outlineOffsetWidth,
	                    'L', bg.width, outlineOffsetWidth
	                ].join(' '),
	                'stroke-width': bg.properties.outline.width,
	                'stroke': bg.properties.outline.fill,
	                'fill': 'none'
	            });
	            sceneGroupEl.appendChild(outlineEl);
	        }

	        sceneGroupEl.appendChild(textGroupEl);
	        svg.appendChild(sceneGroupEl);

	        DOM.setAttr(bgEl, {
	            'width': bg.width,
	            'height': bg.height,
	            'fill': bg.properties.fill
	        });

	        textGroup.y += tpdata.boundingBox.height * 0.8;

	        for (var lineKey in textGroup.children) {
	            var line = textGroup.children[lineKey];
	            for (var wordKey in line.children) {
	                var word = line.children[wordKey];
	                var x = textGroup.x + line.x + word.x;
	                var y = textGroup.y + line.y + word.y;

	                var textEl = DOM.newEl('text', SVG_NS);
	                var textNode = document.createTextNode(null);

	                DOM.setAttr(textEl, {
	                    'x': x,
	                    'y': y
	                });

	                textNode.nodeValue = word.properties.text;
	                textEl.appendChild(textNode);
	                textGroupEl.appendChild(textEl);
	            }
	        }

	        //todo: factor the background check up the chain, perhaps only return reference
	        var svgString = SVG.svgStringToDataURI(SVG.serializeSVG(svg, renderSettings.engineSettings), renderSettings.mode === 'background');
	        return svgString;
	    };
	})();

	//Helpers

	/**
	 * Prevents a function from being called too often, waits until a timer elapses to call it again
	 *
	 * @param fn Function to call
	 */
	function debounce(fn) {
	    if (!App.vars.debounceTimer) fn.call(this);
	    if (App.vars.debounceTimer) global.clearTimeout(App.vars.debounceTimer);
	    App.vars.debounceTimer = global.setTimeout(function() {
	        App.vars.debounceTimer = null;
	        fn.call(this);
	    }, App.setup.debounce);
	}

	/**
	 * Holder-specific resize/orientation change callback, debounced to prevent excessive execution
	 */
	function resizeEvent() {
	    debounce(function() {
	        updateResizableElements(null);
	    });
	}

	//Set up flags

	for (var flag in App.flags) {
	    if (!App.flags.hasOwnProperty(flag)) continue;
	    App.flags[flag].match = function(val) {
	        return val.match(this.regex);
	    };
	}

	//Properties set once on setup

	App.setup = {
	    renderer: 'html',
	    debounce: 100,
	    ratio: 1,
	    supportsCanvas: false,
	    supportsSVG: false,
	    lineWrapRatio: 0.9,
	    dataAttr: 'data-src',
	    renderers: ['html', 'canvas', 'svg']
	};

	App.dpr = function(val) {
	    return val * App.setup.ratio;
	};

	//Properties modified during runtime

	App.vars = {
	    preempted: false,
	    resizableImages: [],
	    invisibleImages: {},
	    invisibleId: 0,
	    visibilityCheckStarted: false,
	    debounceTimer: null,
	    cache: {}
	};

	//Pre-flight

	(function() {
	    var devicePixelRatio = 1,
	        backingStoreRatio = 1;

	    var canvas = DOM.newEl('canvas');
	    var ctx = null;

	    if (canvas.getContext) {
	        if (canvas.toDataURL('image/png').indexOf('data:image/png') != -1) {
	            App.setup.renderer = 'canvas';
	            ctx = canvas.getContext('2d');
	            App.setup.supportsCanvas = true;
	        }
	    }

	    if (App.setup.supportsCanvas) {
	        devicePixelRatio = global.devicePixelRatio || 1;
	        backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	    }

	    App.setup.ratio = devicePixelRatio / backingStoreRatio;

	    if (!!document.createElementNS && !!document.createElementNS(SVG_NS, 'svg').createSVGRect) {
	        App.setup.renderer = 'svg';
	        App.setup.supportsSVG = true;
	    }
	})();

	//Starts checking for invisible placeholders
	startVisibilityCheck();

	if (onDomReady) {
	    onDomReady(function() {
	        if (!App.vars.preempted) {
	            Holder.run();
	        }
	        if (global.addEventListener) {
	            global.addEventListener('resize', resizeEvent, false);
	            global.addEventListener('orientationchange', resizeEvent, false);
	        } else {
	            global.attachEvent('onresize', resizeEvent);
	        }

	        if (typeof global.Turbolinks == 'object') {
	            global.document.addEventListener('page:change', function() {
	                Holder.run();
	            });
	        }
	    });
	}

	module.exports = Holder;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	//Modified version of component/querystring
	//Changes: updated dependencies, dot notation parsing, JSHint fixes
	//Fork at https://github.com/imsky/querystring

	/**
	 * Module dependencies.
	 */

	var encode = encodeURIComponent;
	var decode = decodeURIComponent;
	var trim = __webpack_require__(10);
	var type = __webpack_require__(9);

	var arrayRegex = /(\w+)\[(\d+)\]/;
	var objectRegex = /\w+\.\w+/;

	/**
	 * Parse the given query `str`.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api public
	 */

	exports.parse = function(str){
	  if ('string' !== typeof str) return {};

	  str = trim(str);
	  if ('' === str) return {};
	  if ('?' === str.charAt(0)) str = str.slice(1);

	  var obj = {};
	  var pairs = str.split('&');
	  for (var i = 0; i < pairs.length; i++) {
	    var parts = pairs[i].split('=');
	    var key = decode(parts[0]);
	    var m, ctx, prop;

	    if (m = arrayRegex.exec(key)) {
	      obj[m[1]] = obj[m[1]] || [];
	      obj[m[1]][m[2]] = decode(parts[1]);
	      continue;
	    }

	    if (m = objectRegex.test(key)) {
	      m = key.split('.');
	      ctx = obj;
	      
	      while (m.length) {
	        prop = m.shift();

	        if (!prop.length) continue;

	        if (!ctx[prop]) {
	          ctx[prop] = {};
	        } else if (ctx[prop] && typeof ctx[prop] !== 'object') {
	          break;
	        }

	        if (!m.length) {
	          ctx[prop] = decode(parts[1]);
	        }

	        ctx = ctx[prop];
	      }

	      continue;
	    }

	    obj[parts[0]] = null == parts[1] ? '' : decode(parts[1]);
	  }

	  return obj;
	};

	/**
	 * Stringify the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	exports.stringify = function(obj){
	  if (!obj) return '';
	  var pairs = [];

	  for (var key in obj) {
	    var value = obj[key];

	    if ('array' == type(value)) {
	      for (var i = 0; i < value.length; ++i) {
	        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
	      }
	      continue;
	    }

	    pairs.push(encode(key) + '=' + encode(obj[key]));
	  }

	  return pairs.join('&');
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * onDomReady.js 1.4.0 (c) 2013 Tubal Martin - MIT license
	 *
	 * Specially modified to work with Holder.js
	 */

	function _onDomReady(win) {
	    //Lazy loading fix for Firefox < 3.6
	    //http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
	    if (document.readyState == null && document.addEventListener) {
	        document.addEventListener("DOMContentLoaded", function DOMContentLoaded() {
	            document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
	            document.readyState = "complete";
	        }, false);
	        document.readyState = "loading";
	    }
	    
	    var doc = win.document,
	        docElem = doc.documentElement,
	    
	        LOAD = "load",
	        FALSE = false,
	        ONLOAD = "on"+LOAD,
	        COMPLETE = "complete",
	        READYSTATE = "readyState",
	        ATTACHEVENT = "attachEvent",
	        DETACHEVENT = "detachEvent",
	        ADDEVENTLISTENER = "addEventListener",
	        DOMCONTENTLOADED = "DOMContentLoaded",
	        ONREADYSTATECHANGE = "onreadystatechange",
	        REMOVEEVENTLISTENER = "removeEventListener",
	    
	        // W3C Event model
	        w3c = ADDEVENTLISTENER in doc,
	        _top = FALSE,
	    
	        // isReady: Is the DOM ready to be used? Set to true once it occurs.
	        isReady = FALSE,
	    
	        // Callbacks pending execution until DOM is ready
	        callbacks = [];
	    
	    // Handle when the DOM is ready
	    function ready( fn ) {
	        if ( !isReady ) {
	    
	            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
	            if ( !doc.body ) {
	                return defer( ready );
	            }
	    
	            // Remember that the DOM is ready
	            isReady = true;
	    
	            // Execute all callbacks
	            while ( fn = callbacks.shift() ) {
	                defer( fn );
	            }
	        }
	    }
	    
	    // The ready event handler
	    function completed( event ) {
	        // readyState === "complete" is good enough for us to call the dom ready in oldIE
	        if ( w3c || event.type === LOAD || doc[READYSTATE] === COMPLETE ) {
	            detach();
	            ready();
	        }
	    }
	    
	    // Clean-up method for dom ready events
	    function detach() {
	        if ( w3c ) {
	            doc[REMOVEEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
	            win[REMOVEEVENTLISTENER]( LOAD, completed, FALSE );
	        } else {
	            doc[DETACHEVENT]( ONREADYSTATECHANGE, completed );
	            win[DETACHEVENT]( ONLOAD, completed );
	        }
	    }
	    
	    // Defers a function, scheduling it to run after the current call stack has cleared.
	    function defer( fn, wait ) {
	        // Allow 0 to be passed
	        setTimeout( fn, +wait >= 0 ? wait : 1 );
	    }
	    
	    // Attach the listeners:
	    
	    // Catch cases where onDomReady is called after the browser event has already occurred.
	    // we once tried to use readyState "interactive" here, but it caused issues like the one
	    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
	    if ( doc[READYSTATE] === COMPLETE ) {
	        // Handle it asynchronously to allow scripts the opportunity to delay ready
	        defer( ready );
	    
	    // Standards-based browsers support DOMContentLoaded
	    } else if ( w3c ) {
	        // Use the handy event callback
	        doc[ADDEVENTLISTENER]( DOMCONTENTLOADED, completed, FALSE );
	    
	        // A fallback to window.onload, that will always work
	        win[ADDEVENTLISTENER]( LOAD, completed, FALSE );
	    
	    // If IE event model is used
	    } else {
	        // Ensure firing before onload, maybe late but safe also for iframes
	        doc[ATTACHEVENT]( ONREADYSTATECHANGE, completed );
	    
	        // A fallback to window.onload, that will always work
	        win[ATTACHEVENT]( ONLOAD, completed );
	    
	        // If IE and not a frame
	        // continually check to see if the document is ready
	        try {
	            _top = win.frameElement == null && docElem;
	        } catch(e) {}
	    
	        if ( _top && _top.doScroll ) {
	            (function doScrollCheck() {
	                if ( !isReady ) {
	                    try {
	                        // Use the trick by Diego Perini
	                        // http://javascript.nwbox.com/IEContentLoaded/
	                        _top.doScroll("left");
	                    } catch(e) {
	                        return defer( doScrollCheck, 50 );
	                    }
	    
	                    // detach all dom ready events
	                    detach();
	    
	                    // and execute any waiting functions
	                    ready();
	                }
	            })();
	        }
	    }
	    
	    function onDomReady( fn ) {
	        // If DOM is ready, execute the function (async), otherwise wait
	        isReady ? defer( fn ) : callbacks.push( fn );
	    }
	    
	    // Add version
	    onDomReady.version = "1.4.0";
	    // Add method to check if DOM is ready
	    onDomReady.isReady = function(){
	        return isReady;
	    };

	    return onDomReady;
	}

	module.exports = typeof window !== "undefined" && _onDomReady(window);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var SceneGraph = function(sceneProperties) {
	    var nodeCount = 1;

	    //todo: move merge to helpers section
	    function merge(parent, child) {
	        for (var prop in child) {
	            parent[prop] = child[prop];
	        }
	        return parent;
	    }

	    var SceneNode = function(name) {
	        nodeCount++;
	        this.parent = null;
	        this.children = {};
	        this.id = nodeCount;
	        this.name = 'n' + nodeCount;
	        if (typeof name !== 'undefined') {
	            this.name = name;
	        }
	        this.x = this.y = this.z = 0;
	        this.width = this.height = 0;
	    };

	    SceneNode.prototype.resize = function(width, height) {
	        if (width != null) {
	            this.width = width;
	        }
	        if (height != null) {
	            this.height = height;
	        }
	    };

	    SceneNode.prototype.moveTo = function(x, y, z) {
	        this.x = x != null ? x : this.x;
	        this.y = y != null ? y : this.y;
	        this.z = z != null ? z : this.z;
	    };

	    SceneNode.prototype.add = function(child) {
	        var name = child.name;
	        if (typeof this.children[name] === 'undefined') {
	            this.children[name] = child;
	            child.parent = this;
	        } else {
	            throw 'SceneGraph: child already exists: ' + name;
	        }
	    };

	    var RootNode = function() {
	        SceneNode.call(this, 'root');
	        this.properties = sceneProperties;
	    };

	    RootNode.prototype = new SceneNode();

	    var Shape = function(name, props) {
	        SceneNode.call(this, name);
	        this.properties = {
	            'fill': '#000000'
	        };
	        if (typeof props !== 'undefined') {
	            merge(this.properties, props);
	        } else if (typeof name !== 'undefined' && typeof name !== 'string') {
	            throw 'SceneGraph: invalid node name';
	        }
	    };

	    Shape.prototype = new SceneNode();

	    var Group = function() {
	        Shape.apply(this, arguments);
	        this.type = 'group';
	    };

	    Group.prototype = new Shape();

	    var Rect = function() {
	        Shape.apply(this, arguments);
	        this.type = 'rect';
	    };

	    Rect.prototype = new Shape();

	    var Text = function(text) {
	        Shape.call(this);
	        this.type = 'text';
	        this.properties.text = text;
	    };

	    Text.prototype = new Shape();

	    var root = new RootNode();

	    this.Shape = {
	        'Rect': Rect,
	        'Text': Text,
	        'Group': Group
	    };

	    this.root = root;
	    return this;
	};

	module.exports = SceneGraph;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Shallow object clone and merge
	 *
	 * @param a Object A
	 * @param b Object B
	 * @returns {Object} New object with all of A's properties, and all of B's properties, overwriting A's properties
	 */
	exports.extend = function(a, b) {
	    var c = {};
	    for (var x in a) {
	        if (a.hasOwnProperty(x)) {
	            c[x] = a[x];
	        }
	    }
	    if (b != null) {
	        for (var y in b) {
	            if (b.hasOwnProperty(y)) {
	                c[y] = b[y];
	            }
	        }
	    }
	    return c;
	};

	/**
	 * Takes a k/v list of CSS properties and returns a rule
	 *
	 * @param props CSS properties object
	 */
	exports.cssProps = function(props) {
	    var ret = [];
	    for (var p in props) {
	        if (props.hasOwnProperty(p)) {
	            ret.push(p + ':' + props[p]);
	        }
	    }
	    return ret.join(';');
	};

	/**
	 * Encodes HTML entities in a string
	 *
	 * @param str Input string
	 */
	exports.encodeHtmlEntity = function(str) {
	    var buf = [];
	    var charCode = 0;
	    for (var i = str.length - 1; i >= 0; i--) {
	        charCode = str.charCodeAt(i);
	        if (charCode > 128) {
	            buf.unshift(['&#', charCode, ';'].join(''));
	        } else {
	            buf.unshift(str[i]);
	        }
	    }
	    return buf.join('');
	};

	/**
	 * Checks if an image exists
	 *
	 * @param src URL of image
	 * @param callback Callback to call once image status has been found
	 */
	exports.imageExists = function(src, callback) {
	    var image = new Image();
	    image.onerror = function() {
	        callback.call(this, false);
	    };
	    image.onload = function() {
	        callback.call(this, true);
	    };
	    image.src = src;
	};

	/**
	 * Decodes HTML entities in a string
	 *
	 * @param str Input string
	 */
	exports.decodeHtmlEntity = function(str) {
	    return str.replace(/&#(\d+);/g, function(match, dec) {
	        return String.fromCharCode(dec);
	    });
	};


	/**
	 * Returns an element's dimensions if it's visible, `false` otherwise.
	 *
	 * @param el DOM element
	 */
	exports.dimensionCheck = function(el) {
	    var dimensions = {
	        height: el.clientHeight,
	        width: el.clientWidth
	    };

	    if (dimensions.height && dimensions.width) {
	        return dimensions;
	    } else {
	        return false;
	    }
	};


	/**
	 * Returns true if value is truthy or if it is "semantically truthy"
	 * @param val
	 */
	exports.truthy = function(val) {
	    if (typeof val === 'string') {
	        return val === 'true' || val === 'yes' || val === '1' || val === 'on' || val === '✓';
	    }
	    return !!val;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var DOM = __webpack_require__(7);

	var SVG_NS = 'http://www.w3.org/2000/svg';
	var NODE_TYPE_COMMENT = 8;

	/**
	 * Generic SVG element creation function
	 *
	 * @private
	 * @param svg SVG context, set to null if new
	 * @param width Document width
	 * @param height Document height
	 */
	exports.initSVG = function(svg, width, height) {
	    var defs, style, initialize = false;

	    if (svg && svg.querySelector) {
	        style = svg.querySelector('style');
	        if (style === null) {
	            initialize = true;
	        }
	    } else {
	        svg = DOM.newEl('svg', SVG_NS);
	        initialize = true;
	    }

	    if (initialize) {
	        defs = DOM.newEl('defs', SVG_NS);
	        style = DOM.newEl('style', SVG_NS);
	        DOM.setAttr(style, {
	            'type': 'text/css'
	        });
	        defs.appendChild(style);
	        svg.appendChild(defs);
	    }

	    //IE throws an exception if this is set and Chrome requires it to be set
	    if (svg.webkitMatchesSelector) {
	        svg.setAttribute('xmlns', SVG_NS);
	    }

	    //Remove comment nodes
	    for (var i = 0; i < svg.childNodes.length; i++) {
	        if (svg.childNodes[i].nodeType === NODE_TYPE_COMMENT) {
	            svg.removeChild(svg.childNodes[i]);
	        }
	    }

	    //Remove CSS
	    while (style.childNodes.length) {
	        style.removeChild(style.childNodes[0]);
	    }

	    DOM.setAttr(svg, {
	        'width': width,
	        'height': height,
	        'viewBox': '0 0 ' + width + ' ' + height,
	        'preserveAspectRatio': 'none'
	    });

	    return svg;
	};

	/**
	 * Converts serialized SVG to a string suitable for data URI use
	 * @param svgString Serialized SVG string
	 * @param [base64] Use base64 encoding for data URI
	 */
	exports.svgStringToDataURI = function() {
	    var rawPrefix = 'data:image/svg+xml;charset=UTF-8,';
	    var base64Prefix = 'data:image/svg+xml;charset=UTF-8;base64,';

	    return function(svgString, base64) {
	        if (base64) {
	            return base64Prefix + btoa(unescape(encodeURIComponent(svgString)));
	        } else {
	            return rawPrefix + encodeURIComponent(svgString);
	        }
	    };
	}();

	/**
	 * Returns serialized SVG with XML processing instructions
	 *
	 * @private
	 * @param svg SVG context
	 * @param stylesheets CSS stylesheets to include
	 */
	exports.serializeSVG = function(svg, engineSettings) {
	    if (!global.XMLSerializer) return;
	    var serializer = new XMLSerializer();
	    var svgCSS = '';
	    var stylesheets = engineSettings.stylesheets;

	    //External stylesheets: Processing Instruction method
	    if (engineSettings.svgXMLStylesheet) {
	        var xml = DOM.createXML();
	        //Add <?xml-stylesheet ?> directives
	        for (var i = stylesheets.length - 1; i >= 0; i--) {
	            var csspi = xml.createProcessingInstruction('xml-stylesheet', 'href="' + stylesheets[i] + '" rel="stylesheet"');
	            xml.insertBefore(csspi, xml.firstChild);
	        }

	        xml.removeChild(xml.documentElement);
	        svgCSS = serializer.serializeToString(xml);
	    }

	    var svgText = serializer.serializeToString(svg);
	    svgText = svgText.replace(/\&amp;(\#[0-9]{2,}\;)/g, '&$1');
	    return svgCSS + svgText;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Generic new DOM element function
	 *
	 * @private
	 * @param tag Tag to create
	 * @param namespace Optional namespace value
	 */
	exports.newEl = function(tag, namespace) {
	    if (!global.document) return;

	    if (namespace == null) {
	        return document.createElement(tag);
	    } else {
	        return document.createElementNS(namespace, tag);
	    }
	};

	/**
	 * Generic setAttribute function
	 *
	 * @private
	 * @param el Reference to DOM element
	 * @param attrs Object with attribute keys and values
	 */
	exports.setAttr = function(el, attrs) {
	    for (var a in attrs) {
	        el.setAttribute(a, attrs[a]);
	    }
	};

	/**
	 * Creates a XML document
	 * @private
	 */
	exports.createXML = function() {
	    if (!global.DOMParser) return;
	    return new DOMParser().parseFromString('<xml />', 'application/xml');
	};

	/**
	 * Converts a value into an array of DOM nodes
	 *
	 * @param val A string, a NodeList, a Node, or an HTMLCollection
	 */
	exports.getNodeArray = function(val) {
	    var retval = null;
	    if (typeof(val) == 'string') {
	        retval = document.querySelectorAll(val);
	    } else if (global.NodeList && val instanceof global.NodeList) {
	        retval = val;
	    } else if (global.Node && val instanceof global.Node) {
	        retval = [val];
	    } else if (global.HTMLCollection && val instanceof global.HTMLCollection) {
	        retval = val;
	    } else if (val instanceof Array) {
	        retval = val;
	    } else if (val === null) {
	        retval = [];
	    }
	    return retval;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Color = function (color, options) {
	    //todo: support array->color conversion
	    //todo: support rgba, hsla, and rrggbbaa notation
	    if (typeof color !== 'string') return;

	    if (color.charAt(0) === '#') {
	        color = color.slice(1);
	    }

	    if (/[^a-f0-9]+/i.test(color)) return;

	    if (color.length === 3) {
	        color = color.replace(/./g, '$&$&');
	    }

	    if (color.length !== 6) return;

	    this.alpha = 1;

	    if (options) {
	        this.alpha = options.alpha || this.alpha;
	    }

	    colorSet.call(this, parseInt(color, 16));
	};

	Color.rgbToHex = function (r, g, b) {
	    return (((r | 0) << 16) + ((g | 0) << 8) + (b | 0)).toString(16);
	};

	/**
	 * Sets the color from a raw RGB888 integer
	 * @param raw RGB888 representation of color
	 */
	 //todo: refactor into a more generic method
	function colorSet (raw) {
	    this.rgb = {};
	    this.yuv = {};
	    this.raw = raw;

	    this.rgb.r = (raw & 0xFF0000) >> 16;
	    this.rgb.g = (raw & 0x00FF00) >> 8;
	    this.rgb.b = (raw & 0x0000FF);

	    // BT.709
	    this.yuv.y = 0.2126 * this.rgb.r + 0.7152 * this.rgb.g + 0.0722 * this.rgb.b;
	    this.yuv.u = -0.09991 * this.rgb.r - 0.33609 * this.rgb.g + 0.436 * this.rgb.b;
	    this.yuv.v = 0.615 * this.rgb.r - 0.55861 * this.rgb.g - 0.05639 * this.rgb.b;

	    return this;
	}

	/**
	 * Lighten or darken a color
	 * @param multiplier Amount to lighten or darken (-1 to 1)
	 */
	Color.prototype.lighten = function (multiplier) {
	    var r = this.rgb.r;
	    var g = this.rgb.g;
	    var b = this.rgb.b;

	    var m = (255 * multiplier) | 0;

	    return new Color(Color.rgbToHex(r + m, g + m, b + m));
	};

	/**
	 * Output color in hex format
	 * @param addHash Add a hash character to the beginning of the output
	 */ 
	Color.prototype.toHex = function (addHash) {
	    return (addHash ? '#' : '') + this.raw.toString(16);
	};

	/**
	 * Returns whether or not current color is lighter than another color
	 * @param color Color to compare against
	 */
	Color.prototype.lighterThan = function (color) {
	    if (!(color instanceof Color)) {
	        color = new Color(color);
	    }

	    return this.yuv.y > color.yuv.y;
	};

	/**
	 * Returns the result of mixing current color with another color
	 * @param color Color to mix with
	 * @param multiplier How much to mix with the other color
	 */
	 /*
	Color.prototype.mix = function (color, multiplier) {
	    if (!(color instanceof Color)) {
	        color = new Color(color);
	    }

	    var r = this.rgb.r;
	    var g = this.rgb.g;
	    var b = this.rgb.b;
	    var a = this.alpha;

	    var m = typeof multiplier !== 'undefined' ? multiplier : 0.5;

	    //todo: write a lerp function
	    r = r + m * (color.rgb.r - r);
	    g = g + m * (color.rgb.g - g);
	    b = b + m * (color.rgb.b - b);
	    a = a + m * (color.alpha - a);

	    return new Color(Color.rgbToHex(r, g, b), {
	        'alpha': a
	    });
	};
	*/

	/**
	 * Returns the result of blending another color on top of current color with alpha
	 * @param color Color to blend on top of current color, i.e. "Ca"
	 */
	 //todo: see if .blendAlpha can be merged into .mix
	Color.prototype.blendAlpha = function (color) {
	    if (!(color instanceof Color)) {
	        color = new Color(color);
	    }

	    var Ca = color;
	    var Cb = this;

	    //todo: write alpha blending function
	    var r = Ca.alpha * Ca.rgb.r + (1 - Ca.alpha) * Cb.rgb.r;
	    var g = Ca.alpha * Ca.rgb.g + (1 - Ca.alpha) * Cb.rgb.g;
	    var b = Ca.alpha * Ca.rgb.b + (1 - Ca.alpha) * Cb.rgb.b;

	    return new Color(Color.rgbToHex(r, g, b));
	};

	module.exports = Color;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val)

	  return typeof val;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	exports = module.exports = trim;

	function trim(str){
	  return str.replace(/^\s*|\s*$/g, '');
	}

	exports.left = function(str){
	  return str.replace(/^\s*/, '');
	};

	exports.right = function(str){
	  return str.replace(/\s*$/, '');
	};


/***/ }
/******/ ])
});
;
(function(ctx, isMeteorPackage) {
    if (isMeteorPackage) {
        Holder = ctx.Holder;
    }
})(this, typeof Meteor !== 'undefined' && typeof Package !== 'undefined');

//# sourceMappingURL=vendors.js.map