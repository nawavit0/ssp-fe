/**
 * Flickity fade v1.0.0
 * Fade between Flickity slides
 */

/* jshint browser: true, undef: true, unused: true */

(function(window, factory) {
  // universal module definition
  /*globals define, module, require */
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['flickity/js/index', 'fizzy-ui-utils/utils'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('flickity'), require('fizzy-ui-utils'));
  } else {
    // browser global
    factory(window.Flickity, window.fizzyUIUtils);
  }
})(this, function factory(Flickity, utils) {
  // ---- Slide ---- //

  const Slide = Flickity.Slide;

  const slideUpdateTarget = Slide.prototype.updateTarget;
  Slide.prototype.updateTarget = function() {
    slideUpdateTarget.apply(this, arguments);
    if (!this.parent.options.fade) {
      return;
    }
    // position cells at selected target
    const slideTargetX = this.target - this.x;
    const firstCellX = this.cells[0].x;
    this.cells.forEach(function(cell) {
      const targetX = cell.x - firstCellX - slideTargetX;
      cell.renderPosition(targetX);
    });
  };

  Slide.prototype.setOpacity = function(alpha) {
    this.cells.forEach(function(cell) {
      cell.element.style.opacity = alpha;
    });
  };

  // ---- Flickity ---- //

  const proto = Flickity.prototype;

  Flickity.createMethods.push('_createFade');

  proto._createFade = function() {
    this.fadeIndex = this.selectedIndex;
    this.prevSelectedIndex = this.selectedIndex;
    this.on('select', this.onSelectFade);
    this.on('dragEnd', this.onDragEndFade);
    this.on('settle', this.onSettleFade);
    this.on('activate', this.onActivateFade);
    this.on('deactivate', this.onDeactivateFade);
  };

  const updateSlides = proto.updateSlides;
  proto.updateSlides = function() {
    updateSlides.apply(this, arguments);
    if (!this.options.fade) {
      return;
    }
    // set initial opacity
    this.slides.forEach(function(slide, i) {
      const alpha = i == this.selectedIndex ? 1 : 0;
      slide.setOpacity(alpha);
    }, this);
  };

  /* ---- events ---- */

  proto.onSelectFade = function() {
    // in case of resize, keep fadeIndex within current count
    this.fadeIndex = Math.min(this.prevSelectedIndex, this.slides.length - 1);
    this.prevSelectedIndex = this.selectedIndex;
  };

  proto.onSettleFade = function() {
    delete this.didDragEnd;
    if (!this.options.fade) {
      return;
    }
    // set full and 0 opacity on selected & faded slides
    this.selectedSlide.setOpacity(1);
    const fadedSlide = this.slides[this.fadeIndex];
    if (fadedSlide && this.fadeIndex != this.selectedIndex) {
      this.slides[this.fadeIndex].setOpacity(0);
    }
  };

  proto.onDragEndFade = function() {
    // set flag
    this.didDragEnd = true;
  };

  proto.onActivateFade = function() {
    if (this.options.fade) {
      this.element.classList.add('is-fade');
    }
  };

  proto.onDeactivateFade = function() {
    if (!this.options.fade) {
      return;
    }
    this.element.classList.remove('is-fade');
    // reset opacity
    this.slides.forEach(function(slide) {
      slide.setOpacity('');
    });
  };

  /* ---- position & fading ---- */

  const positionSlider = proto.positionSlider;
  proto.positionSlider = function() {
    if (!this.options.fade) {
      positionSlider.apply(this, arguments);
      return;
    }

    this.fadeSlides();
    this.dispatchScrollEvent();
  };

  const positionSliderAtSelected = proto.positionSliderAtSelected;
  proto.positionSliderAtSelected = function() {
    if (this.options.fade) {
      // position fade slider at origin
      this.setTranslateX(0);
    }
    positionSliderAtSelected.apply(this, arguments);
  };

  proto.fadeSlides = function() {
    if (this.slides.length < 2) {
      return;
    }
    // get slides to fade-in & fade-out
    const indexes = this.getFadeIndexes();
    const fadeSlideA = this.slides[indexes.a];
    const fadeSlideB = this.slides[indexes.b];
    const distance = this.wrapDifference(fadeSlideA.target, fadeSlideB.target);
    let progress = this.wrapDifference(fadeSlideA.target, -this.x);
    progress = progress / distance;

    fadeSlideA.setOpacity(1 - progress);
    fadeSlideB.setOpacity(progress);

    // hide previous slide
    let fadeHideIndex = indexes.a;
    if (this.isDragging) {
      fadeHideIndex = progress > 0.5 ? indexes.a : indexes.b;
    }
    const isNewHideIndex =
      this.fadeHideIndex != undefined &&
      this.fadeHideIndex != fadeHideIndex &&
      this.fadeHideIndex != indexes.a &&
      this.fadeHideIndex != indexes.b;
    if (isNewHideIndex) {
      // new fadeHideSlide set, hide previous
      this.slides[this.fadeHideIndex].setOpacity(0);
    }
    this.fadeHideIndex = fadeHideIndex;
  };

  proto.getFadeIndexes = function() {
    if (!this.isDragging && !this.didDragEnd) {
      return {
        a: this.fadeIndex,
        b: this.selectedIndex,
      };
    }
    if (this.options.wrapAround) {
      return this.getFadeDragWrapIndexes();
    }
    return this.getFadeDragLimitIndexes();
  };

  proto.getFadeDragWrapIndexes = function() {
    const distances = this.slides.map(function(slide, i) {
      return this.getSlideDistance(-this.x, i);
    }, this);
    const absDistances = distances.map(function(distance) {
      return Math.abs(distance);
    });
    const minDistance = Math.min(...absDistances);
    const closestIndex = absDistances.indexOf(minDistance);
    const distance = distances[closestIndex];
    const len = this.slides.length;

    const delta = distance >= 0 ? 1 : -1;
    return {
      a: closestIndex,
      b: utils.modulo(closestIndex + delta, len),
    };
  };

  proto.getFadeDragLimitIndexes = function() {
    // calculate closest previous slide
    let dragIndex = 0;
    for (let i = 0; i < this.slides.length - 1; i++) {
      const slide = this.slides[i];
      if (-this.x < slide.target) {
        break;
      }
      dragIndex = i;
    }
    return {
      a: dragIndex,
      b: dragIndex + 1,
    };
  };

  proto.wrapDifference = function(a, b) {
    let diff = b - a;

    if (!this.options.wrapAround) {
      return diff;
    }

    const diffPlus = diff + this.slideableWidth;
    const diffMinus = diff - this.slideableWidth;
    if (Math.abs(diffPlus) < Math.abs(diff)) {
      diff = diffPlus;
    }
    if (Math.abs(diffMinus) < Math.abs(diff)) {
      diff = diffMinus;
    }
    return diff;
  };

  // ---- wrapAround ---- //

  const _getWrapShiftCells = proto._getWrapShiftCells;
  proto._getWrapShiftCells = function() {
    if (!this.options.fade) {
      _getWrapShiftCells.apply(this, arguments);
    }
  };

  const shiftWrapCells = proto.shiftWrapCells;
  proto.shiftWrapCells = function() {
    if (!this.options.fade) {
      shiftWrapCells.apply(this, arguments);
    }
  };

  return Flickity;
});
