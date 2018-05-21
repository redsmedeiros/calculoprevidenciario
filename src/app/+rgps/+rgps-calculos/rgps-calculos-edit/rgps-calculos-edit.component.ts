import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalculoRgpsService } from '../CalculoRgps.service';
import { ErrorService } from '../../../services/error.service';
import { CalculoRgps as CalculoModel } from '../CalculoRgps.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rgps-calculos-edit',
  templateUrl: './rgps-calculos-edit.component.html',
  styleUrls: ['./rgps-calculos-edit.component.css'],
  providers: [
    ErrorService
  ]
})
export class RgpsCalculosEditComponent implements OnInit, OnDestroy {
  public edit_mode = true;
  
  public styleTheme = 'style-0';
  public styleThemes: Array<string> = ['style-0', 'style-1', 'style-2', 'style-3'];

  public form = {...CalculoModel.form};
  public calculo;

  public isUpdating = false;
  constructor(
    protected CalculoRgps: CalculoRgpsService,
    protected Errors: ErrorService,
    protected router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  		this.isUpdating = true;
  	    this.CalculoRgps.find(this.route.snapshot.params['id_calculo'])
          .then(calculo => {
            this.calculo = calculo;
            this.form = this.calculo;
            this.isUpdating = false;
          });
  	console.log(this.form);
  }


  submit(data) {
    	this.CalculoRgps
          .update(this.calculo)
          .then(model => {
            this.CalculoRgps.get()
                .then(() => this.router.navigate(['/rgps/rgps-calculos/'+this.route.snapshot.params['id']]));
          })
          .catch(errors => this.Errors.add(errors));
  }

  ngOnDestroy(){
  	this.resetForm();
    if (!this.Errors.empty()) {
      Object.keys(this.Errors.all()).forEach(field => {
        this.calculo[field] = this.calculo['_data'][field];
      });
      this.Errors.clear();
    }

  }

  resetForm() {
    this.form = {...CalculoModel.form};
  }

}
