!(function(e, t) {
  'function' === typeof define && define.amd
    ? define(['flickity/js/index', 'fizzy-ui-utils/utils'], t)
    : 'object' === typeof module && module.exports
    ? (module.exports = t(require('flickity'), require('fizzy-ui-utils')))
    : (e.Flickity = t(e.Flickity, e.fizzyUIUtils));
})(window, function(n, a) {
  'use strict';
  n.createMethods.push('_createAsNavFor');
  const e = n.prototype;
  return (
    (e._createAsNavFor = function() {
      this.on('activate', this.activateAsNavFor),
        this.on('deactivate', this.deactivateAsNavFor),
        this.on('destroy', this.destroyAsNavFor);
      const e = this.options.asNavFor;
      if (e) {
        const t = this;
        setTimeout(function() {
          t.setNavCompanion(e);
        });
      }
    }),
    (e.setNavCompanion = function(e) {
      e = a.getQueryElement(e);
      const t = n.data(e);
      if (t && t != this) {
        this.navCompanion = t;
        const i = this;
        (this.onNavCompanionSelect = function() {
          i.navCompanionSelect();
        }),
          t.on('select', this.onNavCompanionSelect),
          this.on('staticClick', this.onNavStaticClick),
          this.navCompanionSelect(!0);
      }
    }),
    (e.navCompanionSelect = function(e) {
      const t = this.navCompanion && this.navCompanion.selectedCells;
      if (t) {
        let i,
          n,
          a,
          o = t[0],
          s = this.navCompanion.cells.indexOf(o),
          c = s + t.length - 1,
          l = Math.floor(
            ((i = s),
            (n = c),
            (a = this.navCompanion.cellAlign),
            (n - i) * a + i),
          );
        if (
          (this.selectCell(l, !1, e),
          this.removeNavSelectedElements(),
          !(l >= this.cells.length))
        ) {
          const v = this.cells.slice(s, 1 + c);
          (this.navSelectedElements = v.map(function(e) {
            return e.element;
          })),
            this.changeNavSelectedClass('add');
        }
      }
    }),
    (e.changeNavSelectedClass = function(t) {
      this.navSelectedElements.forEach(function(e) {
        e.classList[t]('is-nav-selected');
      });
    }),
    (e.activateAsNavFor = function() {
      this.navCompanionSelect(!0);
    }),
    (e.removeNavSelectedElements = function() {
      this.navSelectedElements &&
        (this.changeNavSelectedClass('remove'),
        delete this.navSelectedElements);
    }),
    (e.onNavStaticClick = function(e, t, i, n) {
      'number' === typeof n && this.navCompanion.selectCell(n);
    }),
    (e.deactivateAsNavFor = function() {
      this.removeNavSelectedElements();
    }),
    (e.destroyAsNavFor = function() {
      this.navCompanion &&
        (this.navCompanion.off('select', this.onNavCompanionSelect),
        this.off('staticClick', this.onNavStaticClick),
        delete this.navCompanion);
    }),
    n
  );
});
