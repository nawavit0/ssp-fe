//@flow
export class WishlistGroupModel {
  name: string;
  edit: boolean;
  id: int;
  index: int;
  constructor(name: ?string, edit: ?boolean, id: ?int, index: ?int) {
    if (typeof name === 'object') {
      this.name = name.name;
      this.edit = edit;
      this.id = id;
      this.index = index;
    } else {
      this.name = name || '';
      this.edit = edit || false;
      this.id = id;
      this.index = index;
    }
  }
}
