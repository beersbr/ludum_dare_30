'use strict';

function Node(data, prev, next){
	this.data = data;

	this.prev = prev || null;
	this.next = next || null;
}

function List(){
	this.head = null;
	this.tail = null;


	this.push = function(d){
		var n = this.head;

		if(n == null){
			n = new Node(d, null, null);
			this.tail = n;
		}
		else if(n != null){
			this.tail.next = new Node(data, this.tail, null);
			this.tail = this.tail.next;
		}

		this.len += 1;
	}

	this.length = function(){
		return this.len;
	}

	this.removeIn = function(i){
		
	}

	// only removes one item (first one found)
	this.removeFn = function(cmpFn){
		var n = this.head;
		var data;
		do{
			if(cmpFn(n.data)){
				data = n.data;
				this._rm(n);
				break;
			}
		}while(n = n.next);
		
		return data;
	}

	this._rm = function(node){
		if(node.prev == null){ // is head
			this.head = node.next;
			this.head.prev = null;
			node = null;
			this.len -= 1;
		}
		else if(node.next == null){ // is tail
			this.tail = node.prev;
			this.tail.next = null;
			node = null;
			this.len -= 1;
		}
		else { // is middle
			node.next.prev = node.prev;
			node.prev.next = node.next;
			node = null;
			this.len -= 1;
		}
	}
}
