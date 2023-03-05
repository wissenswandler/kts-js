echo "graph   {a--b}" | dot2svg   > graph___a_b__by__graphviz-wasm.svg
echo "graph   {a--b}" | dot -Tsvg > graph___a_b__by__dot.svg
echo "graph x {a--b}" | dot2svg   > graph_x_a_b__by__graphviz-wasm.svg
echo "graph x {a--b}" | dot -Tsvg > graph_x_a_b__by__dot.svg
echo "graph y {a--{1 2 3 4}; b c d e f g}" | dot2svg                         > graph_y_by_graphviz-wasm.svg
echo "graph y {a--{1 2 3 4}; b c d e f g}" | unflatten -l 5 -c 5 | dot -Tsvg > graph_y_by_ufdot.svg
