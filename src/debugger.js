const {
  dependeciesVisitor,
  initConfigVisitor,
  storeContinuationsVisitor
} = require("../src/staticAnalysis");

module.exports = filename => {
  let { code } = require("../index")(filename, [
    dependeciesVisitor,
    initConfigVisitor,
    storeContinuationsVisitor
  ]);
  let unwindedCode = require("../unwinder/bin/compile.js")(code);

  function restoreProgram(restore) {
    // var input = {};
    // a = input.a || heap.snapshots[restore].a
    b = 8;
    // c = input.c || heap.snapshots[restore].c
    // x = input.x || heap.snapshots[restore].x
  }

  const invokeContinuation = kont => {
    // TODO: Crear inputs para modificar los valores de las variables
    restoreProgram(kont - 1);

    try {
      console.log(`%cStart Continuation ${kont}`,"background: #222; color: #bada55");
      eval(`continuations.kont${kont - 1}();`);
      console.log(`%cEnd Continuation ${kont}`,"background: #222; color: #bada55");
    } catch (e) {
      console.log(e, "Error from VM");
    }
  };

  const createButtons = () => {
    const container = document.getElementById("container");
    let index = 0;
    heap.snapshots.map(() => {
      container.insertAdjacentHTML(
        "beforeend",
        `<div>
            <button kont="${++index}" id="${index}">kont ${index}</button>
        </div>`
      );
    });

    container.addEventListener("click", item => {
      let kont = item.target.getAttribute("kont");
      invokeContinuation(kont);
    });
  };

  try {
    console.log("Start first Eval()");
    eval(unwindedCode);
    console.log("Finish first Eval()");
  } catch (e) {
    console.log(e, "Error from VM");
  }
  createButtons();
};