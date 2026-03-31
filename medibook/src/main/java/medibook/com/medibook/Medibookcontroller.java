package medibook.com.medibook;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Medibookcontroller {
    @RequestMapping("/medibook")
    public String home(){
        return "Welcome to Medibook";
    }
    
}
