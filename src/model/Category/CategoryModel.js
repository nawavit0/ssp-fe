export default class CategoryModel {
  constructor({
    children = [],
    children_count = null,
    children_data = [],
    created_at,
    id,
    include_in_menu,
    is_active,
    level,
    mega_cms_banner = null,
    mega_cms_brand = null,
    mega_cms_menu = null,
    name,
    parent_id,
    position,
    product_count,
    updated_at,
    url_key,
    url_path,
    virtual_category_root,
    mega_cms_brand_fetch = [],
    extension_attributes = [],
  }) {
    this.children = children;
    this.children_count = children_count;
    this.children_data = children_data;
    this.created_at = created_at;
    this.id = id;
    this.include_in_menu = include_in_menu;
    this.is_active = is_active;
    this.level = level;
    this.mega_cms_banner = mega_cms_banner;
    this.mega_cms_brand = mega_cms_brand;
    this.mega_cms_menu = mega_cms_menu;
    this.name = name;
    this.parent_id = parent_id;
    this.position = position;
    this.product_count = product_count;
    this.updated_at = updated_at;
    this.url_key = url_key;
    this.url_path = url_path;
    this.virtual_category_root = virtual_category_root;
    this.mega_cms_brand_fetch = mega_cms_brand_fetch;
    this.extension_attributes = extension_attributes;
  }
}
