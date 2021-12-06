
import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FadeInTop } from 'app/services/shared/animations/fade-in-top.decorator';
import { environment } from 'environments/environment';
import { ErrorService } from 'app/services/error.service';
import { Auth } from 'app/services/Auth/Auth.service';
import { DOCUMENT } from '@angular/platform-browser';
// import { WINDOW } from '../../../+rgps-calculos/window.service';
import swal from 'sweetalert2';
import { SeguradoContagemTempo as SeguradoModel } from 'app/+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.model';
import { SeguradoService } from 'app/+contagem-tempo/+contagem-tempo-segurados/SeguradoContagemTempo.service';
import { SizeFunctions } from 'app/shared/functions/size-functions';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
  selector: 'app-importador-cnis-segurados-list',
  templateUrl: './importador-cnis-segurados-list.component.html',
  styleUrls: ['./importador-cnis-segurados-list.component.css'],
  providers: [
    ErrorService,
  ],
})
export class ImportadorCnisSeguradosListComponent implements OnInit, OnChanges {

  public styleTheme = 'style-0';

  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];
  public isUpdatingListSeg = true;
  public userId;
  public listSegurados = [];
  public seguradoSelecionado;
  public isSeguradoSelecionado = false;

  public form = { ...SeguradoModel.form };
  public segurado;
  public isEditForm = false;
  public formSegurado;



  @Output() seguradoSelecionadoEvent = new EventEmitter();
  @ViewChild('modalSeguradoContagemTempo') public modalSeguradoContagemTempo: ModalDirective;

  public lengthMenuTable = this.setNumberPages();
  private columnsConfig = [
    {
      data: 'actions2CT',
      render: (data, type, row) => {
        return this.getBtnAcoesSeguradoContagem(row.id);
      }, width: '11rem', class: 'text-center'
    },
    { data: 'id', visible: false },
    { data: 'nome' },
    {
      data: 'id_documento',
      render: (data, type, row) => {
        return this.getDocumentType(row.id_documento) + ' ' + row.documento;
      }
    },
    { data: 'data_nascimento' },
    { data: 'data_filiacao' },
    {
      data: 'selecionarSergurado',
      render: (data, type, row) => {
        return this.getBtnSelecionarSegurado(row.id);
      }, width: '6rem', class: 'p-1'
    },

    // { data: 'actions', width: '12rem', class: 'p-1' },
  ];
  public datatableOptions = {
    colReorder: true,
    order: [[0, 'desc']],
    data: this.listSegurados,
    lengthMenu: this.lengthMenuTable,
    columns: this.columnsConfig,
  };


  constructor(
    protected SeguradoService: SeguradoService,
    protected Errors: ErrorService,
    private Auth: Auth,
    protected router: Router,
    private route: ActivatedRoute,
    // @Inject(DOCUMENT) private document: Document,
    // @Inject(WINDOW) private window: Window,
  ) { }

  ngOnInit() {

    this.verificacoesAcesso();
    this.getUserSegurados();
  }


  ngOnChanges(changes: SimpleChanges) {

  }

  setNumberPages() {

    if (!SizeFunctions.isWidthGreaterThan(1366)) {
      return [5, 10, 25, 50, 75, 'All'];
    }
    return [10, 25, 50, 75, 'All'];
  }


  verificacoesAcesso() {

    this.userId = localStorage.getItem('user_id') || this.route.snapshot.queryParams['user_id'];

    if (this.userId) {
      localStorage.setItem('user_id', this.userId);
    } else {
      window.location.href = environment.loginPageUrl;
    }

  }


  getDocumentType(id_documento) {
    switch (id_documento) {
      case 1:
        return 'PIS';
      case 2:
        return 'PASEP';
      case 3:
        return 'CPF';
      case 4:
        return 'NIT';
      case 5:
        return 'RG';
      default:
        return ''
    }
  }


  private getUserSegurados() {

    this.isUpdatingListSeg = true;
    this.listSegurados = [];

    this.SeguradoService.getByUserId(this.userId)
      .then((list: SeguradoModel[]) => {

        this.listSegurados = list;
        localStorage.setItem('user_id', this.userId);
        this.updateDatatable();

      });

  }

  updateDatatable() {

    this.datatableOptions = {
      colReorder: true,
      order: [[0, 'desc']],
      data: this.listSegurados,
      columns: this.columnsConfig,
      lengthMenu: this.lengthMenuTable,
    };

    this.isUpdatingListSeg = false;
  }


  selectSegurado(idSelecionado) {

    this.seguradoSelecionado = {};
    this.seguradoSelecionado = this.listSegurados.find(row => row.id === Number(idSelecionado));

    if (this.isExits(this.seguradoSelecionado)) {

      this.seguradoSelecionadoEvent.emit(this.seguradoSelecionado);

    }

  }

  private getRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.seguradoSelecionado = dataRow;
      this.seguradoSelecionadoEvent.emit(this.seguradoSelecionado);
      this.isSeguradoSelecionado = true;

      sessionStorage.setItem('seguradoSelecionado', JSON.stringify(this.seguradoSelecionado));

    }

  }



  public getBtnSelecionarSegurado(id) {

    return `<div class="checkbox "><label>
                 <input type="checkbox" id='${id}-checkbox-segurado'
                 class="checked-row-one checkbox {{styleTheme}} checkboxSegurado"
                 value="${id}"><span> </span></label>
          </div>`;
  }



  public getBtnAcoesSeguradoContagem(id) {

    return ` <div class="btn-group">
              <button class="btn btn-xs copy-btn txt-color-white bg-color-teal"
                  title="Duplicar" >&nbsp;<i class="fa fa-copy fa-1-7x"></i>&nbsp;</button>
              <button class="btn btn-warning btn-xs update-btn"
                  title="Editar">&nbsp;<i class="fa fa-edit fa-1-7x"></i>&nbsp;</button>
              <button class="btn btn-danger btn-xs delete-btn"
                  title="Deletar" >&nbsp;<i class="fa fa-times fa-1-7x"></i>&nbsp;</button>
        </div>`;
  }



  private isExits(value) {
    return (typeof value !== 'undefined' &&
      value != null && value !== 'null' &&
      value !== undefined && value !== '')
      ? true : false;
  }


  /**
  * Selecionar somente umm checkBox De acordo com a Classe e Id
  * @param idRow id do elemeto unico
  * @param className classe de todos os checkbox
  */
  public unCheckedAll(className) {

    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {
      (<HTMLInputElement>rowCheck).checked = false;
    });

  }

  /**
   * Selecionar somente umm checkBox De acordo com a Classe e Id
   * @param idRow id do elemeto unico
   * @param className classe de todos os checkbox
   */
  public checkedUnique(idRow: string, className: string) {

    // const teste2 = <HTMLInputElement>document.getElementById(idRow);
    // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {

      // if ((<HTMLInputElement>rowCheck).value !== teste2.value) {
      if ((<HTMLInputElement>rowCheck).id !== idRow) {
        (<HTMLInputElement>rowCheck).checked = false;
      }

    });

  }

  /**
   * Selecionar somente umm checkBox De acordo com a Classe e Id
   * @param idRow id do elemeto unico
   * @param className classe de todos os checkbox
   */
  public checkedUniqueCount(idRow: string, className: string) {

    // const teste2 = <HTMLInputElement>document.getElementById(idRow);
    // const teste2 = <HTMLInputElement>document.querySelector('.checkboxSegurado:checked');
    let count = 0
    const listCheckBox = Array.from(document.querySelectorAll(className));
    listCheckBox.forEach((rowCheck) => {

      if ((<HTMLInputElement>rowCheck).id === idRow && (<HTMLInputElement>rowCheck).checked) {
        count++;
      }

    });

    return count;
  }


  // Ações Segurado

  public submit(dataForm) {

    dataForm.user_id = this.userId;

    if (!this.isEditForm) {
      this.createSegurado(dataForm)
    } else {
      this.updateSegurado(dataForm)
    }

  }

  setNewFormSeguradoContagemTempo() {

    this.isEditForm = false;
    this.showChildModal();
  }

  private updateSegurado(data) {

    this.SeguradoService
      .update(data)
      .then(model => {

        this.getUserSegurados();
        this.isEditForm = false;
        this.hideChildModal();
        this.toastAlert('success', 'Segurado salvo com sucesso.', null);

      })
      .catch(errors => { this.Errors.add(errors); console.log(errors) });
  }


  private setUpdateForm(dataRow) {

    this.showChildModal();
    this.isEditForm = true;
    this.form = dataRow;

  }


  private updateRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.setUpdateForm(dataRow);

    }
  }


  private createSegurado(data) {

    data.user_id = this.userId;

    this.SeguradoService
      .save(data)
      .then(model => {

        this.getUserSegurados();
        this.hideChildModal();
        // this.resetForm();
        this.toastAlert('success', 'Cálculo salvo com sucesso.', null);

      })
      .catch(errors => this.Errors.add(errors));

  }

  public copySegurado(calculoRMI) {

    const calculorgps = Object.assign({}, calculoRMI);
    calculorgps.id = null;
    this.createSegurado(calculorgps);

  }

  private copyRow(dataRow) {

    if (this.isExits(dataRow)) {

      this.copySegurado(dataRow);

    }
  }


  private deleteSegurado(segurado) {

    swal({
      title: 'Tem certeza?',
      text: 'Essa ação é irreversível!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.value) {

        const seguradoSelecionado = this.listSegurados.find((seguradoL) => seguradoL.id === segurado.id);

        this.SeguradoService.destroy(seguradoSelecionado)
          .then((model) => {

            this.getUserSegurados();
            this.toastAlert('success', 'Ação concluída.', null);

          }).catch((err) => {
            this.toastAlert('error', 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.', null);
          });


      } else if (result.dismiss === swal.DismissReason.cancel) {

      }

    });
  }


  private deleteRow(dataRow) {

    if (this.isExits(dataRow)) {
      this.deleteSegurado(dataRow)
    }

  }




  public showChildModal(): void {
    this.formSegurado = { ...SeguradoModel.form };
    this.modalSeguradoContagemTempo.show();
  }

  public hideChildModal(): void {
    this.formSegurado = { ...SeguradoModel.form };
    this.modalSeguradoContagemTempo.hide();
  }




  toastAlert(type, title, position) {

    position = (!position) ? 'top-end' : position;

    swal({
      position: position,
      type: type,
      title: title,
      showConfirmButton: false,
      timer: 1500
    });

  }

}
