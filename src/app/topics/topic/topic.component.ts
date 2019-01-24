import {Component, Input, OnInit} from '@angular/core';
import {KafkaEndpoint} from '../../shared/kafka-endpoint.model';
import {Model} from '../../shared/model.model';
import {PublisherService} from '../../services/publisher.service';
import {ModelsService} from '../../services/models.service';
import {Example} from './example';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css'],
  providers: [
    ModelsService,
    PublisherService
  ]
})
export class TopicComponent implements OnInit {
  @Input() endpoint: KafkaEndpoint;
  model: Model;
  defaultExample: Example;
  isOpen = false;

  constructor(
    private modelsService: ModelsService,
    private publisherService: PublisherService
  ) { }

  ngOnInit() {
    this.modelsService
      .getModels()
      .subscribe(models => this.model = models[this.endpoint.payloadModelName]);

    this.defaultExample = new Example(this.endpoint.payloadExample);
  }

  validate(payloadString: string): void {
    const payload = {
      className: this.endpoint.payloadClassName,
      object: JSON.parse(payloadString)
    };

    this.publisherService
      .validate(this.endpoint.topic, payload)
      .subscribe(response => alert(response['message']));
  }

  publish(payloadString: string): void {
    const payload = {
      className: this.endpoint.payloadClassName,
      object: JSON.parse(payloadString)
    };

    this.publisherService
      .publish(this.endpoint.topic, payload)
      .subscribe(
        _ => _,
        error => alert(error['message'])
      );
  }

}
