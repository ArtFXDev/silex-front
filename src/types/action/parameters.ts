export interface BaseParameter {
  label: string;
  name: string;
  type: { name: string };
  value: number | boolean | string | null;
}

export interface StringParameter extends BaseParameter {
  type: { name: "str" };
}

export interface IntegerParameter extends BaseParameter {
  type: { name: "int" };
  value: number | null;
}

export interface BooleanParameter extends BaseParameter {
  type: { name: "bool" };
  value: boolean | null;
}

export interface PathParameter extends BaseParameter {
  type: { name: "Path" };
  value: string | null;
}

export interface RangeParameter extends BaseParameter {
  type: {
    name: "range";
    start: number;
    end: number;
    increment: number;
  };
  value: number | null;
}

export interface SelectParameter extends BaseParameter {
  type: {
    name: "select";
    options: string[];
  };
  value: string | null;
}

export type ParameterInputType =
  | IntegerParameter
  | StringParameter
  | PathParameter;

export type Parameter =
  | PathParameter
  | BooleanParameter
  | IntegerParameter
  | StringParameter
  | RangeParameter
  | SelectParameter;
