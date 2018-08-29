import { Model } from '../../contracts/Model';
import { environment } from '../../../environments/environment';

export class SalarioMinimoMaximo extends Model {

  static url = environment.apiUrl + 'salariominimomaximo';
  static form = {
  	data_salario: '',
    minimum_salary_ammount : '',
    maximum_salary_ammount: '',
  };
  public data_salario;
  public minimum_salary_ammount;
  public maximum_salary_ammount;
}
