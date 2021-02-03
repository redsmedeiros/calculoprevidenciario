import { Component, Input, ElementRef, AfterContentInit, OnInit, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({

  selector: 'sa-datatable',
  template: `
      <table class="dataTable responsive {{tableClass}}" width="{{width}}">
        <ng-content></ng-content>
      </table>
`,
  styles: [
    require('smartadmin-plugins/datatables/datatables.min.css')
  ]
})
export class DatatableComponent implements OnInit {

  @Input() public options: any;
  @Input() public filter: any;
  @Input() public detailsFormat: any;

  @Input() public paginationLength: boolean;
  @Input() public columnsHide: boolean;
  @Input() public responsive: boolean = true;
  @Input() public tableClass: string;
  @Input() public width: string = '100%';

  @Output() selectedRowEvent = new EventEmitter();
  @Output() updateRowEvent = new EventEmitter();
  @Output() deleteRowEvent = new EventEmitter();

  constructor(
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    Promise.all([
      System.import('script-loader!smartadmin-plugins/datatables/datatables.min.js'),
    ]).then(() => {
      this.render()

    })
  }

  render() {
    let element = $(this.el.nativeElement.children[0]);
    let options = this.options || {}

    const selectedRowEvent = this.selectedRowEvent;
    const updateRowEvent = this.updateRowEvent;
    const deleteRowEvent = this.deleteRowEvent;


    let toolbar = '';
    if (options.buttons)
      toolbar += 'B';
    if (this.paginationLength)
      toolbar += 'l';
    if (this.columnsHide)
      toolbar += 'C';

    if (typeof options.ajax === 'string') {
      let url = options.ajax;
      options.ajax = {
        url: url,
        // complete: function (xhr) {
        //
        // }
      }
    }

    options = $.extend(options, {

      "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
      oLanguage: {
        "sSearch": "<span class='input-group-addon'><i class='glyphicon glyphicon-search'></i></span> ",
        "sLengthMenu": "_MENU_"
      },
      "autoWidth": false,
      retrieve: true,
      responsive: this.responsive,
      initComplete: (settings, json) => {
        element.parent().find('.input-sm').removeClass("input-sm").addClass('input-md');
      }
    });

    if (!this.responsive) {
      options["createdRow"] = (row, data, index) => {
        if (index % 2 != 0) {
          $(row).css('background-color', 'white');
        }
      }
    }
    options['oLanguage'] = {
      'sEmptyTable': 'Nenhum registro encontrado',
      'sInfo': 'Mostrando de _START_ até _END_ de _TOTAL_ registros',
      'sInfoEmpty': 'Mostrando 0 até 0 de 0 registros',
      'sInfoFiltered': '(Filtrados de _MAX_ registros)',
      'sInfoPostFix': '',
      'sInfoThousands': '.',
      'sLengthMenu': '_MENU_ resultados por página',
      'sLoadingRecords': 'Carregando...',
      'sProcessing': 'Processando...',
      'sZeroRecords': 'Nenhum registro encontrado',
      'sSearch': 'Pesquisar ',
      'oPaginate': {
        'sNext': 'Próximo',
        'sPrevious': 'Anterior',
        'sFirst': 'Primeiro',
        'sLast': 'Último'
      },
      'oAria': {
        'sSortAscending': ': Ordenar colunas de forma ascendente',
        'sSortDescending': ': Ordenar colunas de forma descendente'
      }
    };

    const _dataTable = element.DataTable(options);

    if (this.filter) {
      // Apply the filter
      element.on('keyup change', 'thead th input[type=text]', function () {
        _dataTable
          .column($(this).parent().index() + ':visible')
          .search(this.value)
          .draw();

      });
    }


    if (!toolbar) {
      element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="assets/img/logo2.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
    }

    if (this.detailsFormat) {
      let format = this.detailsFormat
      element.on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = _dataTable.row(tr);
        if (row.child.isShown()) {
          row.child.hide();
          tr.removeClass('shown');
        }
        else {
          row.child(format(row.data())).show();
          tr.addClass('shown');
        }
      })
    }


    element.on('click', '.select-btn', function () {

      const tr = $(this).closest('tr');
      const row = _dataTable.row(tr);
      selectedRowEvent.emit(row.data());

    });

    element.on('click', '.checked-row', function () {

      const tr = $(this).closest('tr');
      const row = _dataTable.row(tr);
      selectedRowEvent.emit(row.data());

    });

    element.on('click', '.checked-row-one', function () {

      $('.checked-row-one').removeAttr('checked');

      const tr = $(this).closest('tr');
      const row = _dataTable.row(tr);
      selectedRowEvent.emit(row.data());

      $(this).attr('checked', 'checked');

    });

    element.on('click', '.update-btn', function () {

      const tr = $(this).closest('tr');
      const row = _dataTable.row(tr);
      updateRowEvent.emit(row.data());

    });

    element.on('click', '.delete-btn', function () {

      const tr = $(this).closest('tr');
      const row = _dataTable.row(tr);
      deleteRowEvent.emit(row.data());

    });

  }


}
