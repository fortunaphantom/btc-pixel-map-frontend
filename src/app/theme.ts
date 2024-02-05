import { type CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  footer: {
    root: {
      base: "flex flex-col",
    },
    brand: {
      base: "m-6 flex items-center",
    },
    groupLink: {
      base: "flex flex-col flex-wrap text-slate-500 dark:text-white",
      link: {
        base: "mb-4 last:mr-0 md:mr-6",
      },
    },
    icon: {
      base: "text-slate-400 hover:text-slate-900 dark:hover:text-white",
    },
  },
  modal: {
    body: {
      base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
    },
  },
  sidebar: {
    root: {
      base: "h-full bg-slate-50",
      inner:
        "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-slate-800",
    },
    collapse: {
      list: "space-y-2 py-2 list-none",
    },
    item: {
      base: "no-underline flex items-center rounded-lg p-2 text-lg font-normal text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700",
    },
    itemGroup: {
      base: "list-none border-t border-slate-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-slate-700",
    },
  },
  button: {
    base: "group flex items-stretch items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none",
    fullSized: "w-full",
    color: {
      dark: "text-white bg-gray-800 border border-transparent enabled:hover:bg-gray-900 dark:bg-gray-800 dark:enabled:hover:bg-gray-700 dark:border-gray-700",
      failure:
        "text-white bg-red-700 border border-transparent enabled:hover:bg-red-800 dark:bg-red-600 dark:enabled:hover:bg-red-700",
      gray: "text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700  focus:text-cyan-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700",
      info: "text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700",
      light:
        "text-gray-900 bg-white border border-gray-300 enabled:hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:enabled:hover:bg-gray-700 dark:enabled:hover:border-gray-700",
      purple:
        "text-white bg-purple-700 border border-transparent enabled:hover:bg-purple-800 dark:bg-purple-600 dark:enabled:hover:bg-purple-700",
      success:
        "text-white bg-green-700 border border-transparent enabled:hover:bg-green-800 dark:bg-green-600 dark:enabled:hover:bg-green-700",
      warning:
        "text-white bg-yellow-400 border border-transparent enabled:hover:bg-yellow-500",
      blue: "text-white bg-blue-700 border border-transparent enabled:hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
      cyan: "text-cyan-900 bg-white border border-cyan-300 enabled:hover:bg-cyan-100 dark:bg-cyan-600 dark:text-white dark:border-cyan-600 dark:enabled:hover:bg-cyan-700 dark:enabled:hover:border-cyan-700",
      green:
        "text-green-900 bg-white border border-green-300 enabled:hover:bg-green-100 dark:bg-green-600 dark:text-white dark:border-green-600 dark:enabled:hover:bg-green-700 dark:enabled:hover:border-green-700",
      indigo:
        "text-indigo-900 bg-white border border-indigo-300 enabled:hover:bg-indigo-100 dark:bg-indigo-600 dark:text-white dark:border-indigo-600 dark:enabled:hover:bg-indigo-700 dark:enabled:hover:border-indigo-700",
      lime: "text-lime-900 bg-white border border-lime-300 enabled:hover:bg-lime-100 dark:bg-lime-600 dark:text-white dark:border-lime-600 dark:enabled:hover:bg-lime-700 dark:enabled:hover:border-lime-700",
      pink: "text-pink-900 bg-white border border-pink-300 enabled:hover:bg-pink-100 dark:bg-pink-600 dark:text-white dark:border-pink-600 dark:enabled:hover:bg-pink-700 dark:enabled:hover:border-pink-700",
      red: "text-red-900 bg-white border border-red-300 enabled:hover:bg-red-100 dark:bg-red-600 dark:text-white dark:border-red-600 dark:enabled:hover:bg-red-700 dark:enabled:hover:border-red-700",
      teal: "text-teal-900 bg-white border border-teal-300 enabled:hover:bg-teal-100 dark:bg-teal-600 dark:text-white dark:border-teal-600 dark:enabled:hover:bg-teal-700 dark:enabled:hover:border-teal-700",
      yellow:
        "text-yellow-900 bg-white border border-yellow-300 enabled:hover:bg-yellow-100 dark:bg-yellow-600 dark:text-white dark:border-yellow-600 dark:enabled:hover:bg-yellow-700 dark:enabled:hover:border-yellow-700",
    },
    disabled: "cursor-not-allowed opacity-50",
    isProcessing: "cursor-wait",
    spinnerSlot: "absolute h-full top-0 flex items-center animate-fade-in",
    spinnerLeftPosition: {
      xs: "left-2",
      sm: "left-3",
      md: "left-4",
      lg: "left-5",
      xl: "left-6",
    },
    gradient: {
      cyan: "text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 enabled:hover:bg-gradient-to-br",
      failure:
        "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 enabled:hover:bg-gradient-to-br",
      info: "text-white bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 enabled:hover:bg-gradient-to-br",
      lime: "text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 enabled:hover:bg-gradient-to-br",
      pink: "text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 enabled:hover:bg-gradient-to-br",
      purple:
        "text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 enabled:hover:bg-gradient-to-br",
      success:
        "text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 enabled:hover:bg-gradient-to-br",
      teal: "text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 enabled:hover:bg-gradient-to-br",
    },
    gradientDuoTone: {
      cyanToBlue:
        "text-white bg-gradient-to-r from-cyan-500 to-cyan-500 enabled:hover:bg-gradient-to-bl",
      greenToBlue:
        "text-white bg-gradient-to-br from-green-400 to-cyan-600 enabled:hover:bg-gradient-to-bl",
      pinkToOrange:
        "text-white bg-gradient-to-br from-pink-500 to-orange-400 enabled:hover:bg-gradient-to-bl",
      purpleToBlue:
        "text-white bg-gradient-to-br from-purple-600 to-cyan-500 enabled:hover:bg-gradient-to-bl",
      purpleToPink:
        "text-white bg-gradient-to-r from-purple-500 to-pink-500 enabled:hover:bg-gradient-to-l",
      redToYellow:
        "text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 enabled:hover:bg-gradient-to-bl",
      tealToLime:
        "text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 enabled:hover:bg-gradient-to-l enabled:hover:from-teal-200 enabled:hover:to-lime-200 enabled:hover:text-gray-900",
    },
    inner: {
      base: "flex items-stretch items-center transition-all duration-200",
      position: {
        none: "",
        start: "rounded-r-none",
        middle: "rounded-none",
        end: "rounded-l-none",
      },
      outline: "border border-transparent",
      isProcessingPadding: {
        xs: "pl-8",
        sm: "pl-10",
        md: "pl-12",
        lg: "pl-16",
        xl: "pl-20",
      },
    },
    label:
      "ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200 text-xs font-semibold text-cyan-800",
    outline: {
      color: {
        gray: "border border-gray-900 dark:border-white",
        default: "border-0",
        light: "",
      },
      off: "",
      on: "flex justify-center bg-white text-gray-900 transition-all duration-75 ease-in group-enabled:group-hover:bg-opacity-0 group-enabled:group-hover:text-inherit dark:bg-gray-900 dark:text-white w-full",
      pill: {
        off: "rounded-md",
        on: "rounded-full",
      },
    },
    pill: {
      off: "rounded-lg",
      on: "rounded-full",
    },
    size: {
      xs: "text-xs px-2 py-1",
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-5 py-2.5",
      xl: "text-base px-6 py-3",
    },
  },
  tabs: {
    base: "flex flex-col gap-2",
    tablist: {
      base: "flex text-center",
      styles: {
        default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
        underline:
          "flex-wrap -mb-px border-b border-gray-200 dark:border-gray-700",
        pills:
          "flex-wrap font-medium text-sm text-gray-500 dark:text-gray-400 space-x-2",
        fullWidth:
          "w-full text-sm font-medium divide-x divide-gray-200 shadow grid grid-flow-col dark:divide-gray-700 dark:text-gray-400 rounded-none",
      },
      tabitem: {
        base: "flex items-center justify-center p-4 rounded-t-lg font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:outline-none",
        styles: {
          default: {
            base: "rounded-t-lg",
            active: {
              on: "bg-gray-100 text-cyan-600 dark:bg-gray-800 dark:text-cyan-500",
              off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800  dark:hover:text-gray-300",
            },
          },
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "text-cyan-600 rounded-t-lg border-b-2 border-cyan-600 active dark:text-cyan-500 dark:border-cyan-500",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
          pills: {
            base: "",
            active: {
              on: "rounded-lg bg-cyan-600 text-white",
              off: "rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white",
            },
          },
          fullWidth: {
            base: "ml-0 first:ml-0 w-full rounded-none flex",
            active: {
              on: "p-4 text-gray-900 bg-gray-100 active dark:bg-gray-700 dark:text-white rounded-none",
              off: "bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-none",
            },
          },
        },
        icon: "mr-2 h-5 w-5",
      },
    },
    tabitemcontainer: {
      base: "",
      styles: {
        default: "",
        underline: "",
        pills: "",
        fullWidth: "",
      },
    },
    tabpanel: "py-3",
  },
  textInput: {
    base: "flex",
    addon:
      "inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400",
    field: {
      base: "relative w-full",
      icon: {
        base: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      rightIcon: {
        base: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
        svg: "h-5 w-5 text-gray-500 dark:text-gray-400",
      },
      input: {
        base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50",
        sizes: {
          sm: "p-2 sm:text-xs",
          md: "p-2.5 text-sm",
          lg: "sm:text-md p-4",
        },
        colors: {
          gray: "bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500",
          info: "border-cyan-500 bg-cyan-50 text-cyan-900 placeholder-cyan-700 focus:border-cyan-500 dark:border-cyan-400 dark:bg-cyan-100 dark:focus:border-cyan-500",
          failure:
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 dark:border-red-400 dark:bg-red-100 dark:focus:border-red-500",
          warning:
            "border-yellow-500 bg-yellow-50 text-yellow-900 placeholder-yellow-700 focus:border-yellow-500 dark:border-yellow-400 dark:bg-yellow-100 dark:focus:border-yellow-500",
          success:
            "border-green-500 bg-green-50 text-green-900 placeholder-green-700 focus:border-green-500 dark:border-green-400 dark:bg-green-100 dark:focus:border-green-500",
        },
        withRightIcon: {
          on: "pr-10",
          off: "",
        },
        withIcon: {
          on: "pl-10",
          off: "",
        },
        withAddon: {
          on: "rounded-r-lg",
          off: "rounded-lg",
        },
        withShadow: {
          on: "shadow-sm dark:shadow-sm-light",
          off: "",
        },
      },
    },
  },
};
