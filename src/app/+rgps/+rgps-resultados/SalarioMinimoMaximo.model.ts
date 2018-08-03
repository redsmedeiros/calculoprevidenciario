import { Model } from '../../contracts/Model';

export class SalarioMinimoMaximo extends Model {

  static url = 'http://localhost:8000/salariominimomaximo';
  static form = {
  	data_salario: '',
    minimum_salary_ammount : '',
    maximum_salary_ammount: '',
  };
  public data_salario;
  public minimum_salary_ammount;
  public maximum_salary_ammount;
}
