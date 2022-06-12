/* eslint-disable camelcase */
export type ParameterValueType = number | boolean | string;

export interface BaseParameter {
  label: string;
  name: string;
  type: { name: string };
  value: ParameterValueType | ParameterValueType[] | null;
  hide: boolean;
  tooltip: string | null;
}

export interface StringParameter extends BaseParameter {
  type: { name: "str"; maxLenght: number | null; multiline: boolean | null };
  value: string | null;
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
  type: {
    name: "Path";
    multiple: boolean | null;
    extensions: string[] | null;
  };
  value: string | string[] | null;
}

export interface RangeParameter extends BaseParameter {
  type: {
    name: "range";
    start: number;
    end: number;
    increment: number;
    value_label: string | null;
    marks: boolean;
    n_marks: number | null;
  };
  value: number | null;
}

export interface SelectParameter extends BaseParameter {
  type: {
    name: "select";
    options: { [label: string]: string };
  };
  value: string | null;
}

export interface TaskParameter extends BaseParameter {
  type: { name: "task" };
  value: string | null;
}

export interface TaskFileParameter extends BaseParameter {
  type: {
    name: "task_file";
    multiple: boolean | null;
    extensions: string[] | null;
    directory: boolean;
  };
  value: string | string[] | null;
}

export interface MultipleSelectParameter extends BaseParameter {
  type: {
    name: "multiple_select";
    options: { [label: string]: string };
  };
  value: string[] | null;
}

export interface RadioSelectParameter extends BaseParameter {
  type: {
    name: "radio_select";
    options: { [label: string]: string };
  };
  value: string | null;
}

export interface ArrayParameter extends BaseParameter {
  type: { name: "int_array"; size: number };
  value: number[] | null;
}

export interface EditableListParameter extends BaseParameter {
  type: { name: "editable_list" };
  value: string[] | null;
}

export interface TextParameter extends BaseParameter {
  type: {
    name: "text";
    color?: "info" | "error" | "success" | "warning";
    progress: null | {
      value: number;
      variant: "determinate" | "indeterminate";
    };
  };
  value: string | null;
}

export interface FrameSetParameter extends BaseParameter {
  type: { name: "FrameSet" };
  value: string | null;
}

export type ParameterInputType = IntegerParameter | StringParameter;

export type Parameter =
  | PathParameter
  | BooleanParameter
  | IntegerParameter
  | StringParameter
  | RangeParameter
  | SelectParameter
  | TaskParameter
  | MultipleSelectParameter
  | ArrayParameter
  | TextParameter
  | FrameSetParameter
  | RadioSelectParameter
  | TaskFileParameter
  | EditableListParameter;
