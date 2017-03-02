## Install

```
git clone https://github.com/alloy/test-source-maps-with-typescript-through-babel.git
cd test-source-maps-with-typescript-through-babel
yarn install
yarn test
```

## Result

```
-----------------
Original
-----------------
import * as React from "react"

export default function MyComponent() {
  return <div>foo</div>
}
-----------------
tsc output
-----------------
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function MyComponent() {
    return <div>foo</div>;
}
exports.default = MyComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4dHVyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpeHR1cmUudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQThCO0FBRTlCO0lBQ0UsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixDQUFDO0FBRkQsOEJBRUMifQ==
----------------------
babel transform output
----------------------
"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var React=require("react");
function MyComponent(){
return React.createElement("div",null,"foo");
}
exports.default=MyComponent;
----------------------
babel generate output
----------------------
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function MyComponent() {
  return React.createElement(
    "div",
    null,
    "foo"
  );
}
exports.default = MyComponent;
-----------------
Assertions
-----------------
 Original: import * as React fr
Transform: var React=require("
 Generate: "use strict";

 Original: function MyComponent
Transform: function MyComponen
 Generate:  require("react");
```

As you can see, in the case of the transformed code the input source map is correctly merged with the output one.
However, in the case of the generated code it does not seem correct at all.
