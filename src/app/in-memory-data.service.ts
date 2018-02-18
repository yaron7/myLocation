import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './categories/shared/category.model';
import { Location } from './locations/shared/location.model';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {

    let categories: Category[] = [
      { id: 1, name: 'Category1' },
      { id: 2, name: 'Category2' },
      { id: 3, name: 'Category3' }
    ];
    let locations: Location[] = [];

    return { categories, locations };
  }
}
