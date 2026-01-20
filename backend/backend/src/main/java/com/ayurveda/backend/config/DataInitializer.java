package com.ayurveda.backend.config;

import com.ayurveda.backend.entity.Role;
import com.ayurveda.backend.entity.User;
import com.ayurveda.backend.repository.RoleRepository;
import com.ayurveda.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.findAll().isEmpty()) {
            Role superAdmin = new Role();
            superAdmin.setName("SUPER_ADMIN");
            roleRepository.save(superAdmin);

            Role collegeAdmin = new Role();
            collegeAdmin.setName("COLLEGE_ADMIN");
            roleRepository.save(collegeAdmin);

            Role faculty = new Role();
            faculty.setName("FACULTY");
            roleRepository.save(faculty);

            Role dataAnalyst = new Role();
            dataAnalyst.setName("DATA_ANALYST");
            roleRepository.save(dataAnalyst);

            Role viewer = new Role();
            viewer.setName("VIEWER");
            roleRepository.save(viewer);
        }

        // Initialize demo users if they don't exist
        if (userRepository.findAll().isEmpty()) {
            // Create demo SUPER_ADMIN users
            User superAdmin = new User();
            superAdmin.setUsername("admin@ayurveda.com");
            superAdmin.setPassword(passwordEncoder.encode("admin123"));
            superAdmin.setFirstName("Super");
            superAdmin.setLastName("Admin");
            superAdmin.setEmail("admin@ayurveda.com");
            superAdmin.setPhone("1234567890");
            superAdmin.setStatus(User.Status.ACTIVE);
            superAdmin.setRole(roleRepository.findByName("SUPER_ADMIN"));
            userRepository.save(superAdmin);

            User admin1 = new User();
            admin1.setUsername("Admin12");
            admin1.setPassword(passwordEncoder.encode("Admin@123"));
            admin1.setFirstName("Admin");
            admin1.setLastName("Twelve");
            admin1.setEmail("admin12@test.com");
            admin1.setPhone("1234567892");
            admin1.setStatus(User.Status.ACTIVE);
            admin1.setRole(roleRepository.findByName("SUPER_ADMIN"));
            userRepository.save(admin1);

            User admin2 = new User();
            admin2.setUsername("college@ayurveda.com");
            admin2.setPassword(passwordEncoder.encode("college123"));
            admin2.setFirstName("College");
            admin2.setLastName("Admin");
            admin2.setEmail("college@ayurveda.com");
            admin2.setPhone("1234567893");
            admin2.setStatus(User.Status.ACTIVE);
            admin2.setRole(roleRepository.findByName("COLLEGE_ADMIN"));
            userRepository.save(admin2);

            User admin3 = new User();
            admin3.setUsername("admin@demo.com");
            admin3.setPassword(passwordEncoder.encode("Admin@2024"));
            admin3.setFirstName("Demo");
            admin3.setLastName("Administrator");
            admin3.setEmail("admin@demo.com");
            admin3.setPhone("1234567894");
            admin3.setStatus(User.Status.ACTIVE);
            admin3.setRole(roleRepository.findByName("COLLEGE_ADMIN"));
            userRepository.save(admin3);

            // Create demo regular users
            User user1 = new User();
            user1.setUsername("user@ayurveda.com");
            user1.setPassword(passwordEncoder.encode("user123"));
            user1.setFirstName("Demo");
            user1.setLastName("User");
            user1.setEmail("user@ayurveda.com");
            user1.setPhone("9876543210");
            user1.setStatus(User.Status.ACTIVE);
            user1.setRole(roleRepository.findByName("FACULTY"));
            userRepository.save(user1);

            User user2 = new User();
            user2.setUsername("Anchal");
            user2.setPassword(passwordEncoder.encode("Anchal@123"));
            user2.setFirstName("Anchal");
            user2.setLastName("User");
            user2.setEmail("anchal@test.com");
            user2.setPhone("1234567891");
            user2.setStatus(User.Status.ACTIVE);
            user2.setRole(roleRepository.findByName("FACULTY"));
            userRepository.save(user2);

            User user3 = new User();
            user3.setUsername("doctor@test.com");
            user3.setPassword(passwordEncoder.encode("Doctor@123"));
            user3.setFirstName("Dr. Priya");
            user3.setLastName("Sharma");
            user3.setEmail("doctor@test.com");
            user3.setPhone("9876543211");
            user3.setStatus(User.Status.ACTIVE);
            user3.setRole(roleRepository.findByName("FACULTY"));
            userRepository.save(user3);

            User user4 = new User();
            user4.setUsername("analyst@test.com");
            user4.setPassword(passwordEncoder.encode("Analyst@123"));
            user4.setFirstName("Data");
            user4.setLastName("Analyst");
            user4.setEmail("analyst@test.com");
            user4.setPhone("9876543212");
            user4.setStatus(User.Status.ACTIVE);
            user4.setRole(roleRepository.findByName("DATA_ANALYST"));
            userRepository.save(user4);

            User user5 = new User();
            user5.setUsername("viewer@test.com");
            user5.setPassword(passwordEncoder.encode("Viewer@123"));
            user5.setFirstName("Data");
            user5.setLastName("Viewer");
            user5.setEmail("viewer@test.com");
            user5.setPhone("9876543213");
            user5.setStatus(User.Status.ACTIVE);
            user5.setRole(roleRepository.findByName("VIEWER"));
            userRepository.save(user5);

            User user6 = new User();
            user6.setUsername("faculty@test.com");
            user6.setPassword(passwordEncoder.encode("Faculty@123"));
            user6.setFirstName("Faculty");
            user6.setLastName("Member");
            user6.setEmail("faculty@test.com");
            user6.setPhone("9876543214");
            user6.setStatus(User.Status.ACTIVE);
            user6.setRole(roleRepository.findByName("FACULTY"));
            userRepository.save(user6);
        }
    }
}

