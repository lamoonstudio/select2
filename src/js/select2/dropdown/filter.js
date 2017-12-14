define([
  'jquery',
  '../utils'
], function ($, Utils) {
  function Filter (decorated, $element, options) {
    decorated.call(this, $element, options);
    this.filters = options.get('filters');
  }

  Filter.prototype.render = function (decorated) {
    var $rendered = decorated.call(this);
    var $filterContainer = $(
      '<div class="select2-filter">' +
        this.filters.map(function(filter) {
          return '<label>' +
          '<input type="radio" name="filter" value="' + filter.name +'"/>' +
          '<span>' + filter.display + '</span>' +
          '</label>'
        }).join('') +
      '</div>'
    );

    this.$filterContainer = $filterContainer;
    this.$filter = $filterContainer.find('input:radio');
    $filterContainer.find('input:radio:first')
      .prop('checked', true)
      .parent()
      .addClass('filter-selected');

    $rendered.find('input').parent().append($filterContainer);

    return $rendered;
  };

  Filter.prototype.bind = function (decorated, container, $container) {
    var self = this;

    decorated.call(this, container, $container);

    this.$filter.on('change', function () {
      self.handleSearch();

      self.$filter.parent().removeClass('filter-selected');
      $(this).parent().addClass('filter-selected');
    });

    container.on('open', resetFilterUI.bind(this));

    function resetFilterUI() {
      this.$filterContainer.find('input:radio')
        .prop('checked', false)
        .parent()
        .removeClass('filter-selected');

      this.$filterContainer.find('input:radio:first')
        .prop('checked', true)
        .parent()
        .addClass('filter-selected');
    }
  };

  Filter.prototype.handleSearch = function (evt) {
    if (!this._keyUpPrevented) {
      var input = this.$search.val();
      var selectedFilter = this.$filterContainer.find('input[type="radio"]:checked').val();
      this.trigger('query', {
        term: input,
        filter: selectedFilter
      });
    }

    this._keyUpPrevented = false;
  };

  return Filter;
});
