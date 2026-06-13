package com.example.spendmanagement.service;

import com.example.spendmanagement.entity.Category;
import com.example.spendmanagement.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<Category> findAll() {
        return repo.findAll();
    }

    public Category findById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
    }

    public Category create(Category category) {
        return repo.save(category);
    }

    public Category update(UUID id, Category updated) {
        Category existing = findById(id);
        existing.setName(updated.getName());
        return repo.save(existing);
    }

    public void delete(UUID id) {
        findById(id);
        repo.deleteById(id);
    }
}
