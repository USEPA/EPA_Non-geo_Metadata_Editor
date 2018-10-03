
TODO
====

General
-------

* Do not allow reactive functions to return strings etc. because no
  fields can be tucked in them (alternatively, wrap them).


Virtual DOM
-----------

* Accumulate DOM operations in a buffer and prioritize by visibility.

* Error when erasing reactive parts when collapsing VNode children.

* Do not collapse array children in VNode because this can erase
  reactive parts. Collapse only in the DOM.

* Smarter clobbering of `<input>` when both their ID and their
  position in the children change.

* Jump straight to the relevant children in `transform-patch`;
  will require a good amount of code.


Done
====

