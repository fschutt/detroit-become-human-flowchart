window.onload = function() {

    const TRIANGLE_WIDTH = 200;
    const TRIANGLE_HEIGHT = 173.199;

    function get_window_wh() {
        const MAX_WIDTH = Math.max(
            document.documentElement["clientWidth"],
            document.body["scrollWidth"],
            document.documentElement["scrollWidth"],
            document.body["offsetWidth"],
            document.documentElement["offsetWidth"]
        );

        const MAX_HEIGHT = Math.max(
            document.documentElement["clientHeight"],
            document.body["scrollHeight"],
            document.documentElement["scrollHeight"],
            document.body["offsetHeight"],
            document.documentElement["offsetHeight"]
        );

        return [MAX_WIDTH, MAX_HEIGHT];
    }

    const [MAX_WIDTH, MAX_HEIGHT] = get_window_wh();
    let triangle_renderer_background = new TriangleRenderer(
        document.getElementById('triangle-container'),
        MAX_WIDTH,
        MAX_HEIGHT,
        TRIANGLE_WIDTH,
        TRIANGLE_HEIGHT);

    // first screen update
    triangle_renderer_background.create_dom(MAX_WIDTH, MAX_HEIGHT);
    triangle_renderer_background.animate_triangles_small();
    triangle_renderer_background.animate_triangles_large();
    triangle_renderer_background.update_dom();

    // start animation
    triangle_renderer_background.set_triangle_timers();

    document.body.addEventListener("wheel", do_scroll);

    window.onresize = function() {
        triangle_renderer_background.create_dom(MAX_WIDTH, MAX_HEIGHT);
        triangle_renderer_background.animate_triangles_small();
        triangle_renderer_background.animate_triangles_large();
        triangle_renderer_background.update_dom();
    }
}

function do_scroll(wheel_event) {
    if (wheel_event.wheelDeltaY) {
        window.scrollBy(-wheel_event.wheelDeltaY, 0);
    } else if (wheel_event.deltaY) {
        if (wheel_event.deltaY > 0) {
            window.scrollBy(120, 0);
        } else {
            window.scrollBy(-120, 0);
        }
    }
}