package com.microinterns.hrplatform.services;

import com.microinterns.hrplatform.models.Case;
import com.microinterns.hrplatform.models.HRUser;
import com.microinterns.hrplatform.repositories.CaseRepository;
import com.microinterns.hrplatform.repositories.HRUserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private HRUserRepository hrUserRepository;

    // 🔥 REASSIGN CASE
    public Case reassignCase(Long caseId, Long newOwnerId) {

        Case c = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        HRUser newOwner = hrUserRepository.findById(newOwnerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        c.setReassignedTo(newOwner);
        c.setOwner(newOwner);

        return caseRepository.save(c);
    }
}