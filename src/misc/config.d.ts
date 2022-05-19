/* ConfigSubChildren */
export class ConfigSubChildren {
    id: string;
    name: string;
    fullName: string;
    thumbnail: string;
    main: string;
    main_es5: string;
    hasPannel?: boolean;
    pannelFiles?: any[];
    libs?: string[];
    resources?: string[];
    params?: string;

    temp?: string;
    hidden?: boolean;
}

/* ConfigChildren */
export class ConfigChildren {
    id: string;
    name: string;
    count: number;
    details: string;
    children: ConfigSubChildren[];
}

/* ConfigModel */
export class ConfigModel {
    id: string;
    name: string;
    count: number;
    icon: string;
    children: ConfigChildren[];
}
