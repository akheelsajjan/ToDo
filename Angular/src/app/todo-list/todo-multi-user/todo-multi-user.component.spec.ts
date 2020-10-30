import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoMultiUserComponent } from './todo-multi-user.component';

describe('TodoMultiUserComponent', () => {
  let component: TodoMultiUserComponent;
  let fixture: ComponentFixture<TodoMultiUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoMultiUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoMultiUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
