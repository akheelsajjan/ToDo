import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSingleUserComponent } from './todo-single-user.component';

describe('TodoSingleUserComponent', () => {
  let component: TodoSingleUserComponent;
  let fixture: ComponentFixture<TodoSingleUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSingleUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoSingleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
