package com.walletwise.api.service;

import com.walletwise.api.dto.AdminStatisticsDto;
import com.walletwise.api.dto.UserDto;
import com.walletwise.api.dto.UserStatisticsDto;
import com.walletwise.api.model.User;
import com.walletwise.api.repository.InvestmentRepository;
import com.walletwise.api.repository.LoanRepository;
import com.walletwise.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private InvestmentRepository investmentRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Integer userId) {
        return userRepository.findById(userId)
                .map(this::mapToUserDto)
                .orElse(null);
    }

    public boolean activateUser(Integer userId) {
        return updateStatus(userId, true);
    }

    public boolean deactivateUser(Integer userId) {
        return updateStatus(userId, false);
    }

    private boolean updateStatus(Integer userId, boolean status) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        user.setActive(status);
        userRepository.save(user);
        return true;
    }

    public AdminStatisticsDto getStatistics() {
        List<User> users = userRepository.findAll();
        // Naive implementation fetching all data, mirroring .NET behavior which might be slow for large data
        // But requested to migrate logic. Optimized queries would be better.
        // Given UserRepo/LoanRepo are simple JPA repos, we can count.
        
        long totalUsers = userRepository.count();
        long activeUsers = users.stream().filter(User::isActive).count();
        long inactiveUsers = totalUsers - activeUsers;
        
        long totalLoans = loanRepository.count();
        long totalInvestments = investmentRepository.count();

        // Warning: Loading all into memory for Sum. Optimally use @Query("SELECT SUM(...)")
        BigDecimal totalLoanAmount = loanRepository.findAll().stream()
                .map(l -> l.getPrincipalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalInvestmentAmount = investmentRepository.findAll().stream()
                .map(i -> i.getPrincipalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<UserStatisticsDto> userStats = users.stream().map(u -> {
            UserStatisticsDto dto = new UserStatisticsDto();
            dto.setUserId(u.getUserId());
            dto.setEmail(u.getEmail());
            dto.setName(u.getFirstName() + " " + u.getLastName());
            dto.setActive(u.isActive());
            dto.setLoanCount(loanRepository.findByUserId(u.getUserId()).size()); // N+1 problem here, but copying logic
            dto.setInvestmentCount(investmentRepository.findByUserId(u.getUserId()).size());
            return dto;
        }).collect(Collectors.toList());

        AdminStatisticsDto stats = new AdminStatisticsDto();
        stats.setTotalUsers((int)totalUsers);
        stats.setActiveUsers((int)activeUsers);
        stats.setInactiveUsers((int)inactiveUsers);
        stats.setTotalLoans((int)totalLoans);
        stats.setTotalInvestments((int)totalInvestments);
        stats.setTotalLoanAmount(totalLoanAmount);
        stats.setTotalInvestmentAmount(totalInvestmentAmount);
        stats.setUserStatistics(userStats);
        return stats;
    }

    private UserDto mapToUserDto(User u) {
        UserDto dto = new UserDto();
        dto.setUserId(u.getUserId());
        dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setPhoneNumber(u.getPhoneNumber());
        dto.setActive(u.isActive());
        dto.setRoles(u.getUserRoles().stream().map(r -> r.getRoleName()).collect(Collectors.toList()));
        dto.setCreatedAt(u.getCreatedAt());
        return dto;
    }
}
