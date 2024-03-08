import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { ReportDetails, ReportService } from '$backend/services';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { DateConverterModule } from '$shared/date-converter';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TinyEditorModule } from '$shared/tiny-editor';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatChipsModule,
    DateConverterModule,
    MatInputModule,
    MatFormFieldModule,
    TinyEditorModule,
    ReactiveFormsModule,
  ],
})
export class ReportPageComponent implements AfterViewInit {
  @Input() report!: ReportDetails;

  reportService = inject(ReportService);

  replyForm = inject(FormBuilder).group({
    reply: ['', Validators.required],
  });

  reply: boolean = false;

  async ngAfterViewInit() {
    if (this.report.isRead) {
      return;
    }

    await this.reportService.reportsReadPatchAsync({
      body: { id: this.report.id },
    });
  }

  sendReply(newReply: typeof this.replyForm.value) {
    this.reply = false;

    console.log(newReply);
  }
}
