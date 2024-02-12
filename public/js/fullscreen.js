!(function(e, t) {
  'function' === typeof define && define.amd
    ? define(['flickity/js/index'], t)
    : 'object' === typeof module && module.exports
    ? (module.exports = t(require('flickity')))
    : t(e.Flickity);
})(window, function(e) {
  'use strict';
  e.createMethods.push('_createFullscreen');
  const t = e.prototype;
  (t._createFullscreen = function() {
    (this.isFullscreen = !1),
      this.options.fullscreen &&
        ((this.viewFullscreenButton = new n('view', this)),
        (this.exitFullscreenButton = new n('exit', this)),
        this.on('activate', this._changeFullscreenActive),
        this.on('deactivate', this._changeFullscreenActive));
  }),
    (t._changeFullscreenActive = function() {
      const e = this.isActive ? 'appendChild' : 'removeChild';
      this.element[e](this.viewFullscreenButton.element),
        this.element[e](this.exitFullscreenButton.element);
      const t = this.isActive ? 'activate' : 'deactivate';
      this.viewFullscreenButton[t](), this.exitFullscreenButton[t]();
    }),
    (t.viewFullscreen = function() {
      this._changeFullscreen(!0), this.focus();
    }),
    (t.exitFullscreen = function() {
      this._changeFullscreen(!1);
    }),
    (t._changeFullscreen = function(e) {
      if (this.isFullscreen != e) {
        const t = (this.isFullscreen = e) ? 'add' : 'remove';
        document.documentElement.classList[t]('is-flickity-fullscreen'),
          this.element.classList[t]('is-fullscreen'),
          this.resize(),
          this.isFullscreen && this.reposition(),
          this.dispatchEvent('fullscreenChange', null, [e]);
      }
    }),
    (t.toggleFullscreen = function() {
      this._changeFullscreen(!this.isFullscreen);
    });
  const i = t.setGallerySize;
  function n(e, t) {
    (this.name = e),
      this.createButton(),
      this.createIcon(),
      (this.onClick = function() {
        t[`${e}Fullscreen`]();
      }),
      (this.clickHandler = this.onClick.bind(this));
  }
  (t.setGallerySize = function() {
    this.options.setGallerySize &&
      (this.isFullscreen ? (this.viewport.style.height = '') : i.call(this));
  }),
    (e.keyboardHandlers[27] = function() {
      this.exitFullscreen();
    }),
    (n.prototype.createButton = function() {
      const e = (this.element = document.createElement('button'));
      (e.className = `flickity-button flickity-fullscreen-button flickity-fullscreen-button-${this.name}`),
        e.setAttribute('type', 'button');
      let t,
        i = (t = `${this.name} full-screen`)[0].toUpperCase() + t.slice(1);
      e.setAttribute('aria-label', i), (e.title = i);
    });
  let s = 'http://www.w3.org/2000/svg',
    l = {
      view: 'M15,20,7,28h5v4H0V20H4v5l8-8Zm5-5,8-8v5h4V0H20V4h5l-8,8Z',
      exit: 'M32,3l-7,7h5v4H18V2h4V7l7-7ZM3,32l7-7v5h4V18H2v4H7L0,29Z',
    };
  return (
    (n.prototype.createIcon = function() {
      const e = document.createElementNS(s, 'svg');
      e.setAttribute('class', 'flickity-button-icon'),
        e.setAttribute('viewBox', '0 0 32 32');
      let t = document.createElementNS(s, 'path'),
        i = l[this.name];
      t.setAttribute('d', i), e.appendChild(t), this.element.appendChild(e);
    }),
    (n.prototype.activate = function() {
      this.element.addEventListener('click', this.clickHandler);
    }),
    (n.prototype.deactivate = function() {
      this.element.removeEventListener('click', this.clickHandler);
    }),
    (e.FullscreenButton = n),
    e
  );
});
