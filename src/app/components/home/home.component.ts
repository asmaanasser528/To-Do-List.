import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { title } from 'process';
import { AuthService } from '../../services/auth.service';
import { NotesService } from '../../services/notes.service';
declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  noteList: any;
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _NotesService = inject(NotesService);
  ngOnInit(): void {
    this.getUserNote();
  }
  addNoteForm: FormGroup = this._FormBuilder.group({
    title: [null, [Validators.required]],
    content: [null, [Validators.required]],
  });
  UpdateNoteForm: FormGroup = this._FormBuilder.group({
    _id: [null],
    title: [null, [Validators.required]],
    content: [null, [Validators.required]],
  });

  addNote() {
    this._NotesService.addNote(this.addNoteForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.addNoteForm.reset();
        $('#exampleModal').modal('hide');
        this.getUserNote();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getUserNote() {
    this._NotesService.getUserNotes().subscribe({
      next: (res) => {
        this.noteList = res.notes;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.noteList = [];
      },
    });
  }
  deleteNote(id: any) {
    this._NotesService.deleteNote(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserNote();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  setUpdateModal(note: any) {
    $('#updateModal').modal('show');
    this.UpdateNoteForm.patchValue(note);
  }
  UpdateNote() {
    const { _id, content, title } = this.UpdateNoteForm.value;
    this._NotesService.updateNote(_id, { content, title }).subscribe({
      next: (res) => {
        console.log(res);
        this.getUserNote();
        $('#updateModal').modal('hide');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
