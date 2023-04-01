# bounds-observer

A React wrapper for [BoundingClientRectObserver](https://www.npmjs.com/package/@html-ng/bounding-client-rect-observer)

Usage:

```tsx
import {useState, useCallback} from "react";

const [activate, setActivate] = useState(true);

const onBoundsChange = useCallback((bounds: DOMRect) => {
    // Do something...  
}, []);

return (
    <BoundsObserver
        activate={activate}
        onBoundsChange={onBoundsChange}
    >
        {child}
    </BoundsObserver>
);
```

`onBoundsChange` will be fired when the `child` bounds change, but only when `activate` is `true`. Try to keep the
callback stable.
