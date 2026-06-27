package com.stationerynook.config;

import com.stationerynook.model.Product;
import com.stationerynook.model.User;
import com.stationerynook.repository.ProductRepository;
import com.stationerynook.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            List<Product> defaultProducts = Arrays.asList(
                    new Product("notebook", "Spiral Notebook", "200 pages of smooth paper for school notes.", 120.0),
                    new Product("pen-set", "Gel Pen Pack", "Set of 10 pens with bright ink colors.", 220.0),
                    new Product("marker", "Highlighter Set", "Four neon highlighters for easy studying.", 160.0),
                    new Product("folder", "Document Folder", "Keep your handouts neat and ready for class.", 80.0),
                    new Product("pencil-case", "Pencil Case", "A durable pouch for pens, pencils and erasers.", 140.0),
                    new Product("sticky-notes", "Sticky Notes", "Perfect for quick reminders and bookmarks.", 60.0),
                    new Product("desk-organizer", "Desk Organizer", "Keep your study table tidy with compartments for every tool.", 360.0),
                    new Product("journal", "Eco Journal", "Plant-based paper journal for notes, sketches, and study planning.", 180.0),
                    new Product("pencil-pack", "Graphite Pencil Pack", "Set of 12 smooth writing pencils for everyday notes.", 110.0),
                    new Product("ruler-set", "Ruler + Protractor Set", "Essential geometry tools for classes and projects.", 85.0),
                    new Product("glue-stick", "Washable Glue Stick", "Clean and easy adhesive for school crafts and homework.", 70.0),
                    new Product("tab-notes", "Sticky Tab Notes", "Colorful tabs for marking pages, reminders and study sections.", 90.0)
            );
            productRepository.saveAll(defaultProducts);
        }

        if (userRepository.findByEmail("admin@stationary.com").isEmpty()) {
            User admin = new User(
                    "Admin",
                    "admin@stationary.com",
                    passwordEncoder.encode("admin123"),
                    "owner"
            );
            userRepository.save(admin);
        }
    }
}
