package app.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    @RequestMapping(path = "/socket/client", produces = MediaType.TEXT_HTML_VALUE)
    public String clientPage() {
        return "client";
    }

    @RequestMapping(path = "/socket/manager", produces = MediaType.TEXT_HTML_VALUE)
    public String managerPage() {
        return "manager";
    }
}
