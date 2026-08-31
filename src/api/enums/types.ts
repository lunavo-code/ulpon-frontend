export interface EnumInfo {
    model: string;
    key: string;
    name: string;
    desc: string;
    values: EnumItem[];
}

export interface EnumItem {
  code: string;
  label: string;
  desc?: string;
}
