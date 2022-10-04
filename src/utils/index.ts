import Vue, { Component } from "vue";
function creatComponent(
  component: Component,
  containter: HTMLElement,
  props: { [key: string]: any } = {},
  emitEvent: { [key: string]: () => void } = {}
): Vue {
  const comp: Vue = new Vue({
    render(createElement) {
      return createElement(component, {
        props,
        on: emitEvent,
      });
    },
  }).$mount();

  containter.appendChild(comp.$el);

  // comp.remove = (): void => {
  //   containter.removeChild(comp.$el);
  //   comp.$destroy();
  // };
  return comp;
}

export { creatComponent };
