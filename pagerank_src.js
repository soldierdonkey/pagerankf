const decay = 0.85;
is_mouse_down = false
currently_connecting = -1
document.addEventListener("mousedown", _ => {
    is_mouse_down = true
})
document.addEventListener("mouseup", _ => {
    is_mouse_down = false
    currently_connecting = -1
    document.getElementById("main").style.cursor = "default"
})
class Website {
    constructor(parent, link_list, parent_index) {
        this.parent_index = parent_index
        this.parent = parent
        this.link_list = link_list
        this._x = 0
        this._y = 0
        this.x = value => {
            this._x = value
            this.element.style.left = this._x + "px"
            return this
        }
        this.y = value => {
            this._y = value
            this.element.style.top = this._y + "px"
            return this
        }
        this.get_x = () => {
            return this._x
        }
        this.get_y = () => {
            return this._y
        }
        this.element = document.createElement("div")
        this.element.classList.add("website")
        this.name_element = document.createElement("div")
        this.name_element.classList.add("name")
        this.name_element.contentEditable = true
        this.element.appendChild(this.name_element)
        this._rank = NaN
        this.rank_element = document.createElement("div")
        this.rank_element.classList.add("rank")
        this.element.appendChild(this.rank_element)
        this.connect_button = document.createElement("div")
        this.connect_button.classList.add("connect_button")
        this.connect_button.addEventListener("mousedown", () => {
            currently_connecting = this.parent_index
            document.getElementById("main").style.cursor = "alias"
        })
        this.element.appendChild(this.connect_button)
        this.delete_button = document.createElement("div")
        this.delete_button.classList.add("delete_button")
        this.delete_button.addEventListener("mousedown", () => {
            this.remove()
        })
        this.element.appendChild(this.delete_button)
        this.rank = rank => {
            this._rank = rank
            this.rank_element.innerText = this._rank.toFixed(3)
            return this
        }
        this.name = name => {
            this.name_element.innerText = name
            return this
        }
        this.is_mouse_down = false
        this.element.addEventListener("mousedown", _ => {
            this.element.style.zIndex = 10
            this.is_mouse_down = true
        })
        this.element.addEventListener("mouseup", _ => {
            this.element.style.zIndex = 3
            this.is_mouse_down = false
            if (currently_connecting > -1) {
                if (this.parent.website_list[currently_connecting].link_list.indexOf(this.parent_index) > -1) {
                    this.parent.website_list[currently_connecting].link_list.splice(this.parent.website_list[currently_connecting].link_list.indexOf(this.parent_index), 1)
                } else {
                    this.parent.website_list[currently_connecting].link_list.push(this.parent_index)
                }
                this.parent.calculate()
                this.parent.clear_lines()
                this.parent.draw_all_connections()
            }
        })
        this.element.addEventListener("mousemove", event => {
            if (is_mouse_down && currently_connecting == -1) {
                this.x(event.clientX - 50)
                this.y(event.clientY - 50)
                this.parent.clear_lines()
                this.parent.draw_all_connections()
            }
        })
        this.parent.element.appendChild(this.element)
        this.remove = () => {
            for (let index = 0; index < this.parent.website_list.length; index++) {
                if (this.parent.website_list[index].link_list.indexOf(this.parent_index) > -1) {
                    this.parent.website_list[index].link_list.splice(this.parent.website_list[index].link_list.indexOf(this.parent_index), 1)
                }
            }
            this.link_list = []
            this.element.remove()
            this.parent.calculate()
            this.parent.clear_lines()
            this.parent.draw_all_connections()
        }
    }
}
class Web {
    constructor() {
        this.canvas = document.createElement("canvas")
        this.canvas.classList.add("canvas")
        this.canvas.style.zIndex = -1
        this.context = this.canvas.getContext("2d")
        this.canvas.width = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"])
        this.canvas.height = Math.max(document.documentElement["clientHeight"], document.body["scrollHeight"], document.documentElement["scrollHeight"], document.body["offsetHeight"], document.documentElement["offsetHeight"])
        document.getElementById("main").appendChild(this.canvas)
        this.element = document.createElement("div")
        this.control_panel = document.createElement("div")
        this.control_panel.classList.add("control_panel")
        this.control_tab = document.createElement("div")
        this.control_tab.classList.add("control_tab")
        this.control_panel.appendChild(this.control_tab)
        this.description = document.createElement("div")
        this.description.appendChild(document.createTextNode("All circles are draggable\nRed dots remove Websites\nGreen dots connect Sites"))
        this.control_panel.appendChild(this.description)
        this.description.classList.add("description")
        this.iterations_slider = document.createElement("input")
        this.iterations_slider.type = "range"
        this.iterations_slider.classList.add("slider")
        this.iterations_slider.min = 1
        this.iterations_slider.step = 1
        this.iterations_slider.max = 50
        this.iterations_slider.value = 35
        this.iterations = 35
        this.control_panel.appendChild(this.iterations_slider)
        this.iterations_slider_label = document.createElement("div")
        this.iterations_slider_label.appendChild(document.createTextNode("Iterations: "))
        this.iterations_slider_label.classList.add("slider_label")
        this.iterations_slider_label_display = document.createElement("span")
        this.iterations_slider_label_display.innerText = 35
        this.iterations_slider_label.appendChild(this.iterations_slider_label_display)
        this.iterations_slider.addEventListener("input", () => {
            this.iterations = this.iterations_slider.value
            this.iterations_slider_label_display.innerText = this.iterations_slider.value
            this.calculate()
        })
        this.control_panel.appendChild(this.iterations_slider_label)
        this.add_new_website_button = document.createElement("div")
        this.add_new_website_button.classList.add("add_new_website_button")
        this.add_new_website_button.addEventListener("mouseup", () => {
            this.add_new_website([], "New Website", this.get_control_x(), this.get_control_y())
        })
        this.add_new_website_button_text = document.createElement("div")
        this.add_new_website_button_text.appendChild(document.createTextNode("New Website"))
        this.add_new_website_button_text.classList.add("add_new_website_button_text")
        this.add_new_website_button.appendChild(this.add_new_website_button_text)
        this.control_panel.appendChild(this.add_new_website_button)
        document.getElementById("main").appendChild(this.control_panel)
        this._control_x = 0
        this._control_y = 0
        this.control_x = value => {
            this._control_x = value
            this.control_panel.style.left = this._control_x + "px"
            return this
        }
        this.control_y = value => {
            this._control_y = value
            this.control_panel.style.top = this._control_y + "px"
            return this
        }
        this.get_control_x = () => {
            return this._control_x
        }
        this.get_control_y = () => {
            return this._control_y
        }
        this.control_x(10)
        this.control_y(10)
        this.control_tab.addEventListener("mousemove", event => {
            if (is_mouse_down) {
                this.control_x(event.clientX - 50)
                this.control_y(event.clientY - 50)
            }
        })
        this.control_tab.addEventListener("mousedown", _ => {
            this.control_panel.style.zIndex = 10
        })
        this.control_tab.addEventListener("mouseup", _ => {
            this.control_panel.style.zIndex = 2
        })
        document.getElementById("main").appendChild(this.element)
        this.website_list = []
        this.rankings = []
        for (let index = 0; index < this.website_list.length; index++) {
            this.rankings.push(0.25)
        }
        this.calculate_rank = requested_index => {
            let output = 0
            for (let current_index = 0; current_index < this.website_list.length; current_index++) {
                if (current_index != requested_index && this.website_list[current_index].link_list.includes(requested_index)) {
                    output += this.rankings[current_index] / this.website_list[current_index].link_list.length
                }
            }
            return (1 - decay) + decay * output
        }
    }
    generate_line_coordinates(index_origin, index_target) {
        let sign_x = Math.sign(this.website_list[index_target].get_x() - this.website_list[index_origin].get_x())
        let sign_y = Math.sign(this.website_list[index_target].get_y() - this.website_list[index_origin].get_y())
        let angle_xy = (this.website_list[index_target].get_x() - this.website_list[index_origin].get_x()) / (this.website_list[index_target].get_y() - this.website_list[index_origin].get_y())
        let angle_yx = (this.website_list[index_target].get_y() - this.website_list[index_origin].get_y()) / (this.website_list[index_target].get_x() - this.website_list[index_origin].get_x())
        return [
            this.website_list[index_target].get_x() - sign_x * Math.sqrt(2500 / (1 + ((angle_yx) ** 2))) + 50,
            this.website_list[index_target].get_y() - sign_y * Math.sqrt(2500 / (1 + ((angle_xy) ** 2))) + 50,
            this.website_list[index_origin].get_x() + 50,
            this.website_list[index_origin].get_y() + 50,
            this.website_list[index_target].get_x() - sign_x * Math.sqrt(3600 / (1 + ((angle_yx) ** 2))) - sign_y * Math.sqrt(100 / (1 + ((angle_xy) ** 2))) + 50,
            this.website_list[index_target].get_y() - sign_y * Math.sqrt(3600 / (1 + ((angle_xy) ** 2))) + sign_x * Math.sqrt(100 / (1 + ((angle_yx) ** 2))) + 50,
            this.website_list[index_target].get_x() - sign_x * Math.sqrt(3600 / (1 + ((angle_yx) ** 2))) + sign_y * Math.sqrt(100 / (1 + ((angle_xy) ** 2))) + 50,
            this.website_list[index_target].get_y() - sign_y * Math.sqrt(3600 / (1 + ((angle_xy) ** 2))) - sign_x * Math.sqrt(100 / (1 + ((angle_yx) ** 2))) + 50,
        ]
    }
    draw_all_connections() {
        for (let website_index = 0; website_index < this.website_list.length; website_index++) {
            for (let link_index = 0; link_index < this.website_list[website_index].link_list.length; link_index++) {
                this.draw_line(...this.generate_line_coordinates(website_index, this.website_list[website_index].link_list[link_index]))
            }
        }
        return this
    }
    clear_lines() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    draw_line(origin_x, origin_y, target_x, target_y, target_wing_0_x, target_wing_0_y, target_wing_1_x, target_wing_1_y) {
        this.context.beginPath()
        this.context.moveTo(origin_x, origin_y)
        this.context.lineTo(target_x, target_y)
        this.context.lineWidth = 2
        this.context.stroke()
        this.context.beginPath()
        this.context.lineTo(origin_x, origin_y)
        this.context.lineTo(target_wing_0_x, target_wing_0_y)
        this.context.lineTo(target_wing_1_x, target_wing_1_y)
        this.context.lineTo(origin_x, origin_y)
        this.context.lineWidth = 2
        this.context.stroke()
    }
    add_new_website(link_list, name = "", x = 0, y = 0) {
        this.website_list.push(new Website(this, link_list, this.website_list.length).name(name).x(x).y(y))
        this.calculate()
        return this
    }
    calculate() {
        this.rankings = []
        for (let index = 0; index < this.website_list.length; index++) {
            this.rankings.push(0.25)
        }
        for (let current_iteration = 0; current_iteration < this.iterations; current_iteration++) {
            let rankings = []
            for (let index = 0; index < this.website_list.length; index++) {
                rankings.push(this.calculate_rank(index))
            }
            this.rankings = rankings
        }
        for (let index = 0; index < this.website_list.length; index++) {
            this.website_list[index].rank(this.rankings[index])
        }
        return this
    }
}
web = new Web()